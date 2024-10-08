import { z } from 'zod';
import { ResponseSuccessBase } from '$schemas/api';
import { Base36BigInt } from '$schemas/misc';
import { SessionData } from '$schemas/auth';

export const ApiV1LoginRequestWithPassword = z.object({
	type: z.literal('password'),
	email: z.string().email(),
	password: z.string().min(1)
});

export const ApiV1LoginRequestWithWebAuthn = z.object({
	type: z.literal('webauthn')
	//TODO: add webauthn schema
});

export type ApiV1LoginRequestWithPassword = z.infer<typeof ApiV1LoginRequestWithPassword>;

export const ApiV1LoginRequest = z
	.discriminatedUnion('type', [ApiV1LoginRequestWithPassword, ApiV1LoginRequestWithWebAuthn])
	.and(
		z.object({
			into: z.enum(['bearer', 'cookie']).optional()
		})
	);

export type ApiV1LoginRequest = z.infer<typeof ApiV1LoginRequest>;

export const ApiV1LoginResponse = ResponseSuccessBase.extend({
	bearer: z.string().optional(),
	user: z.object({
		id: Base36BigInt,
		email: z.string().email().optional()
	})
});

export type ApiV1LoginResponse = z.infer<typeof ApiV1LoginResponse>;

export const ApiV1AuthStatusAuthenticated = ResponseSuccessBase.extend({
	authenticated: z.literal(true),
	user: SessionData
});
export type ApiV1AuthStatusAuthenticated = z.infer<typeof ApiV1AuthStatusAuthenticated>;
export const ApiV1AuthStatusUnauthenticated = ResponseSuccessBase.extend({
	authenticated: z.literal(false)
});
export type ApiV1AuthStatusUnauthenticated = z.infer<typeof ApiV1AuthStatusUnauthenticated>;
export const ApiV1AuthStatus = ResponseSuccessBase.and(
	ApiV1AuthStatusAuthenticated.or(ApiV1AuthStatusUnauthenticated)
);
export type ApiV1AuthStatus = z.infer<typeof ApiV1AuthStatus>;
