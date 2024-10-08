import type { RequestHandler } from '@sveltejs/kit';
import { ProblemDetails } from '$schemas/api_problem';

import { ZodType } from 'zod';
import { building } from '$app/environment';
import { SessionCookieName } from '$lib/consts';
import {
	PROBLEM_DETAILS_GENERIC_INTERNAL_SERVER_ERROR,
	PROBLEM_DETAILS_UNAUTHORIZED,
	respond_problem
} from '$lib/server/api/problem';

export type HandlerOptions = {
	/**
	 * If true, the handler will require the user to be logged in otherwise it will respond with a 401.
	 * This delays the handler until the session is validated. Otherwise, the session will be validated in the background and the response will be sent immediately.
	 * @default false
	 */
	auth?: boolean;
};

export const extend_handler = <
	Params extends Partial<Record<string, string>> = Partial<Record<string, string>>,
	RouteId extends string | null = string | null
>(
	handler: RequestHandler<Params, RouteId>,
	options?: HandlerOptions
): RequestHandler<Params, RouteId> => {
	return async (event) => {
		const { request, cookies, url, locals } = event;
		try {
			function get_bearer_token(): string | null {
				const auth_header = request.headers.get('Authorization');
				if (auth_header && auth_header.startsWith('Bearer ')) {
					return auth_header.substring(7);
				} else {
					return null;
				}
			}

			const token = get_bearer_token() || cookies.get(SessionCookieName);
			if (token && !building) {
				//we dont need to await this unless we enfoce user to be logged in
				locals.session = import('$lib/server/auth/session')
					.then((m) => m.validate_token)
					.then((validate_token) => validate_token(token));
			} else {
				locals.session = Promise.resolve(undefined);
			}

			if (options?.auth) {
				const session = await locals.session;
				if (!session) {
					return respond_problem(PROBLEM_DETAILS_UNAUTHORIZED);
				}
			}
			return await handler(event);
		} catch (e) {
			//If the error object maches the problem details schema, we will respond with that
			const maybe_problem = (await ProblemDetails.safeParseAsync(e))?.data;
			if (maybe_problem) {
				return respond_problem(maybe_problem);
			} else {
				console.error("handler error '", url, "' :", e);
				return respond_problem(PROBLEM_DETAILS_GENERIC_INTERNAL_SERVER_ERROR);
			}
		}
	};
};

export async function validate_or_problem<O>(schema: ZodType<O>, data: unknown) {
	const result = await schema.safeParseAsync(data, { async: true });
	if (result.success && result.data) {
		return result.data;
	} else {
		throw {
			success: false,
			status: 400,
			type: 'https://httpstatuses.com/400',
			title: 'Invalid request body',
			detail: result?.error?.message ?? undefined,
			validation_errors: result?.error?.errors ?? undefined
		} satisfies ProblemDetails;
	}
}
