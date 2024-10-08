import type { RequestHandler } from './$types';
import { extend_handler, validate_or_problem } from '$lib/server/api/extend';
import { json } from '@sveltejs/kit';
import type { ProblemDetails } from '$schemas/api_problem';
import { type ApiV1AuthStatus, ApiV1LoginRequest, type ApiV1LoginResponse } from '$schemas/api_v1';
import type { UsersData } from '$lib/server/loader/user_data';

export const GET: RequestHandler = extend_handler(
	async ({ locals }) => {
		const session = await locals.session;
		if (session) {
			return json({
				success: true,
				authenticated: true,
				user: {
					id: session.id.toString(36),
					email: session.email ?? undefined
				}
			} satisfies ApiV1AuthStatus);
		} else {
			return json({
				success: true,
				authenticated: false
			} satisfies ApiV1AuthStatus);
		}
	},
	{ auth: false }
);

export const POST: RequestHandler = extend_handler(async ({ request, cookies }) => {
	let request_body;
	try {
		request_body = await request.json();
	} catch {
		throw {
			success: false,
			status: 400,
			type: 'https://httpstatuses.com/400',
			title: 'Invalid JSON'
		} satisfies ProblemDetails;
	}
	const login_request_body = await validate_or_problem(ApiV1LoginRequest, request_body);
	let login_data: UsersData | undefined;
	switch (login_request_body.type) {
		case 'password':
			login_data = await import('$lib/server/auth/password_auth')
				.then((m) => m.login_with_password)
				.then((login_with_password) =>
					login_with_password(login_request_body.email, login_request_body.password)
				);
			break;
		case 'webauthn':
			throw {
				success: false,
				status: 501,
				type: 'https://httpstatuses.com/501',
				title: 'Not implemented yet'
			} satisfies ProblemDetails;
	}
	if (login_data) {
		const token = await import('$lib/server/auth/session')
			.then((m) => m.create_token)
			.then((create_token) =>
				create_token(login_data.id, login_data?.session_secret ?? undefined, '14d')
			);
		const respond_bearer = login_request_body.into === 'bearer';

		if (!login_request_body.into && login_request_body.into === 'cookie') {
			import('$lib/server/auth/session')
				.then((m) => m.set_session_cookie)
				.then((set_session_cookie) => set_session_cookie(cookies, token, '14d'));
		}
		return json({
			success: true,
			bearer: respond_bearer ? token : undefined,
			user: {
				id: login_data.id.toString(36),
				email: login_data.email ?? undefined
			}
		} satisfies ApiV1LoginResponse);
	} else {
		throw {
			success: false,
			status: 401,
			type: 'https://httpstatuses.com/401',
			title: 'Invalid credentials'
		} satisfies ProblemDetails;
	}
});
