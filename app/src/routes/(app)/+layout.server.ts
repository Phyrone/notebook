import type { LayoutLoad, LayoutServerLoad } from './$types';
import Negotiator from 'negotiator';
import { locales } from '$lib/locales';

export const load: LayoutServerLoad = async ({ request, locals }) => {
	return {
		lang: locals.locale
	};
};
