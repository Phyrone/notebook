import 'zod-openapi/extend';
import { z } from 'zod';
import { createDocument } from 'zod-openapi';
import {
	GenericInternalServerErrorProblem,
	MIME_PROBLEM_JSON,
	ProblemDetails
} from '$schemas/api_problem';
import { ApiV1AuthStatus } from '$schemas/api_v1';

export const openapi_schema = createDocument({
	openapi: '3.0.3',
	info: {
		title: 'API',
		version: '0.0.1',
		description: 'API description'
	},
	paths: {
		'/api/v1/auth': {
			get: {
				description: 'Get Current Session Data',
				responses: {
					200: {
						content: {
							'application/json': {
								schema: ApiV1AuthStatus
							}
						}
					},
					401: {
						content: {
							[MIME_PROBLEM_JSON]: {
								schema: ProblemDetails.extend({
									status: z.literal(401),
									title: z.literal('Unauthorized'),
									detail: z.string().optional()
								})
							}
						}
					},
					500: {
						content: {
							[MIME_PROBLEM_JSON]: {
								schema: GenericInternalServerErrorProblem
							}
						}
					}
				}
			}
		}
	}
});
