import { users_table } from '$database/users_table';
import { and, eq, isNotNull } from 'drizzle-orm';
import { verify, hash, argon2id } from 'argon2';
import { building } from '$app/environment';
import { db, db_ro } from '$lib/server/database/sql';
import type { UsersData } from '$lib/server/loader/user_data';

if (building)
	throw 'password_auth.server.ts must not be imported during build time, only during runtime';

export async function login_with_password(
	user: string | bigint,
	password: string
): Promise<UsersData | undefined> {
	const user_selector =
		typeof user === 'bigint'
			? eq(users_table.id, user)
			: and(eq(users_table.email, user.toLowerCase()), isNotNull(users_table.emailVerified));

	const selected_user = await db_ro
		.select()
		.from(users_table)
		.where(and(user_selector, isNotNull(users_table.password)))
		.then((e) => e[0]);

	if (selected_user && selected_user.password && selected_user.email) {
		const valid = await verify(selected_user.password, password);
		if (valid) {
			return selected_user;
		}
	}
	return undefined;
}

export async function set_password(user_id: bigint, password: string | undefined): Promise<void> {
	const hashed_password = password
		? await hash(password, {
				type: argon2id,
				hashLength: 256
			})
		: null;

	await db
		.update(users_table)
		.set({ password: hashed_password })
		.where(eq(users_table.id, user_id))
		.returning({ new_password: users_table.password });
}
