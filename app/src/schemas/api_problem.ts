import { z } from 'zod';
import { ResponseBase } from '$schemas/api';

export const MIME_PROBLEM_JSON = 'application/problem+json';

export const HttpErrorCode = z.number().min(400).max(599);

export const ProblemDetails = ResponseBase.extend({
	success: z.literal(false),
	status: HttpErrorCode,
	type: z.string().url(),
	title: z.string(),
	detail: z.string().optional(),
	instance: z.string().optional()
}).passthrough();
export type ProblemDetails = z.infer<typeof ProblemDetails>;

/* Well-known problems */

export const GenericInternalServerErrorProblem = ProblemDetails.extend({
	status: z.literal(500),
	title: z.literal('Internal Server Error'),
	type: z.literal('https://example.com/docs/error')
});

export type GenericInternalServerErrorProblem = z.infer<typeof GenericInternalServerErrorProblem>;

export const ProblemUnauthorized = ProblemDetails.extend({
	status: z.literal(401),
	title: z.literal('Unauthorized'),
	type: z.literal('https://example.com/docs/error')
});
export type ProblemUnauthorized = z.infer<typeof ProblemUnauthorized>;
