import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';
import { i18n_instance } from '$lib/locales';
import { ApiV1AuthStatus } from '$schemas/api_v1';
import { writable } from 'svelte/store';
import type { ContextSessionDataType } from '$schemas/auth';

export const load: LayoutLoad = async ({ data, fetch }) => {
	const auth_status_response_unsafe = await fetch('/api/v1/auth').then((r) => r.json());

	const auth_status = await ApiV1AuthStatus.parseAsync(auth_status_response_unsafe);
	const session_data = auth_status.authenticated ? auth_status.user : undefined;
	//console.log('[Auth]', 'session', session_data);
	const session_data_store: ContextSessionDataType = writable(session_data);

	const i18n = await i18n_instance();
	if (!browser) {
		const negotiated_lang = data?.lang;
		if (negotiated_lang) {
			await i18n.changeLanguage(negotiated_lang);
		}
	}

	return {
		i18n,
		data,
		session_data: session_data_store
	};
};
