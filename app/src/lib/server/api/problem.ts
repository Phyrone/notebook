import {
	type GenericInternalServerErrorProblem,
	MIME_PROBLEM_JSON,
	ProblemDetails,
	type ProblemUnauthorized
} from '$schemas/api_problem';
import { json } from '@sveltejs/kit';
import { z } from 'zod';

export function respond_problem(details: ProblemDetails): Response {
	return json(details, {
		status: details.status,
		statusText: details.title,
		headers: {
			'Content-Type': MIME_PROBLEM_JSON
		}
	});
}

export const PROBLEM_DETAILS_GENERIC_INTERNAL_SERVER_ERROR: GenericInternalServerErrorProblem = {
	success: false,
	status: 500,
	//TODO replace error type with a real one
	type: 'https://example.com/docs/error',
	title: 'Internal Server Error'
};

export const PROBLEM_DETAILS_UNAUTHORIZED: ProblemUnauthorized = {
	success: false,
	status: 401,
	type: 'https://example.com/docs/error',
	title: 'Unauthorized'
};
