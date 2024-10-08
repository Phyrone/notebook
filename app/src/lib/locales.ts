import i18next, { type i18n } from 'i18next';
import type { BackendModule, InitOptions, ReadCallback, Services } from 'i18next';
import { z } from 'znv';
import { browser } from '$app/environment';

export const I18NContext = 'i18n';

const locale_files = import.meta.glob('/src/locales/*/*.json', { import: 'default', eager: false });
export const locales = Object.keys(locale_files).map((path) => path.split('/')[3]);

const namespaces = ['metadata', 'default'];

function key_to_path(language: string, namespace: string) {
	return `/src/locales/${language}/${namespace}.json`;
}

const backend: BackendModule = {
	type: 'backend',
	init(services: Services, backendOptions: object, i18nextOptions: InitOptions): void {},
	read(language: string, namespace: string, callback: ReadCallback): void {
		const path = key_to_path(language, namespace);
		const load_func = locale_files[path];
		const LOADING_KEY = `[i18n] loading ${language}/${namespace}`;
		console.time(LOADING_KEY);
		(async () => {
			if (load_func) {
				const lang_doc = await load_func();
				return z.any().parse(lang_doc);
			} else {
				console.warn(`[i18n] missing ${language}/${namespace}`);
				return undefined;
			}
		})()
			.then(
				(doc) => callback(null, doc),
				(err) => callback(err, undefined)
			)
			.finally(() => console.timeEnd(LOADING_KEY));
	}
};
export const i18n_init_process = (async () => {
	await i18next.use(backend).init({
		load: 'all',
		defaultNS: 'default',
		fallbackLng: 'en',
		ns: namespaces,
		supportedLngs: locales,
		preload: browser ? false : locales,
		cleanCode: true,
		initImmediate: !browser,
		lng: browser ? navigator.language : undefined,
		interpolation: {
			escapeValue: false
		}
	});
})();

export async function i18n_instance(): Promise<i18n> {
	await i18n_init_process;
	return browser ? i18next : i18next.cloneInstance();
}
