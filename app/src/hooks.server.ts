import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import Negotiator from 'negotiator';
import { locales } from '$lib/locales';

const set_html_locale: Handle = async ({ event, resolve }) => {
	let transformed: boolean = false;
	const { request, locals } = event;
	const negotiator = new Negotiator({
		headers: {
			['accept-language']: request.headers.get('accept-language') ?? undefined
		}
	});
	locals.locale = negotiator.language(locales);

	return resolve(event, {
		async transformPageChunk({
			html
		}: {
			html: string;
			done: boolean;
		}): Promise<string | undefined> {
			if (!transformed && html.includes('%app.locale%')) {
				//replace first occurrence of %app.locale% with the locale
				html = html.replace('%app.locale%', locals.locale ?? 'en');
				transformed = true;
			}

			return html;
		}
	});
};

export const handle: Handle = sequence(set_html_locale);
