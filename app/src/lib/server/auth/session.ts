import jsonwebtoken from 'jsonwebtoken';
import { z } from 'zod';
import { Base36BigInt, parse_bigint_base36 } from '$schemas/misc';

import { users_table } from '$database/users_table';
import { and, eq, isNull } from 'drizzle-orm';
import type { Cookies } from '@sveltejs/kit';
import ms from 'ms';
import { secure_random_bytes, secure_random_string } from '$scripts/utils.server';
import { building } from '$app/environment';
import { db } from '$lib/server/database/sql';
import { user_data_cache, user_data_loader } from '$lib/server/loader/user_data';
import { JWT_ALGORITHM, SessionCookieName } from '$lib/consts';

if (building) throw 'sessions module must not be imported during build time, only during runtime';

async function create_session_secret(user_id: bigint, overwrite: boolean): Promise<Buffer> {
	const new_session_secret = secure_random_bytes(128);
	const returned = await db
		.update(users_table)
		.set({ session_secret: new_session_secret })
		.where(
			overwrite
				? eq(users_table.id, user_id)
				: and(eq(users_table.id, user_id), isNull(users_table.session_secret))
		)
		.returning({ actual_session: users_table.session_secret })
		.then((e) => e[0]);

	user_data_cache.del(user_id.toString());
	if (returned.actual_session) {
		return returned.actual_session;
	} else {
		throw new Error('Session secret did not update or user does not exist');
	}
}

const { sign, verify, decode } = jsonwebtoken;

const UserTokenSchema = z.object({
	sub: Base36BigInt,
	iat: z.number().int(),
	//expiration is optional for now, but might be required in the future
	exp: z.number().int().optional()
});

export type SessionData = {
	id: bigint;
	name: string;
	email: string | null;
};

export async function create_token(
	user_id: bigint,
	//if session secret is already known, it can be passed here to avoid a potential database query
	session_secret?: Buffer,
	//Its recomded to set a timeout when the session expires, this may be mandatory in the future
	timeout?: string | number
): Promise<string> {
	const session_secret1 =
		session_secret ??
		(await user_data_loader.load(user_id))?.session_secret ??
		(await create_session_secret(user_id, false));

	return sign({}, session_secret1, {
		expiresIn: timeout,
		algorithm: JWT_ALGORITHM,
		noTimestamp: false,
		allowInsecureKeySizes: false,
		mutatePayload: true,
		subject: user_id.toString(36)
	});
}

export function set_session_cookie(
	cookies: Cookies,
	token: string,
	timeout?: string | number
): void {
	const timeout_ms = timeout ? (typeof timeout === 'string' ? ms(timeout) : timeout) : undefined;
	const timeout_s = timeout_ms
		? timeout_ms / 1000 /* will be rounded down by sveltekit*/
		: undefined;
	cookies.set(SessionCookieName, token, {
		path: '/',
		sameSite: 'strict',
		secure: true,
		priority: 'high',
		httpOnly: true,
		maxAge: timeout_s
	});
}

export async function validate_token_unspecific(
	token: string,
	get_detail: (user_id: bigint) => Promise<[Buffer, SessionData] | undefined>
): Promise<SessionData | undefined> {
	const unsafe_decoded = decode(token);
	try {
		if (!unsafe_decoded) {
			return undefined;
		}
		const unsafe_payload = await UserTokenSchema.safeParseAsync(unsafe_decoded).then((e) => e.data);
		//Payload is not a valid JWT
		if (!unsafe_payload) {
			return undefined;
		} else {
			const user_id = parse_bigint_base36(unsafe_payload.sub);
			const user_data = await get_detail(user_id);
			if (user_data) {
				verify(token, user_data[0], {
					algorithms: [JWT_ALGORITHM],
					subject: unsafe_payload.sub,
					allowInvalidAsymmetricKeyTypes: false,
					ignoreExpiration: false,
					ignoreNotBefore: false
				});
				return user_data[1];
			} else {
				return undefined;
			}
		}
	} catch (e) {
		return undefined;
	}
}

export async function validate_token(token: string): Promise<SessionData | undefined> {
	return validate_token_unspecific(token, async (user_id) => {
		const data = await user_data_loader.load(user_id);
		if (data && data.session_secret) {
			return [
				data.session_secret,
				{
					id: user_id,
					name: data.name,
					email: data.email ?? null
				} satisfies SessionData
			];
		} else return undefined;
	});
}
