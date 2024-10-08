import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { openapi_schema } from '$schemas/openapi';

export const prerender = true;

export const GET: RequestHandler = async () => {
	return json(openapi_schema);
};
