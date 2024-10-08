import adapter_static from '@sveltejs/adapter-static';
import adapter_node from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const IS_TAURI = process.env.TAURI_ENV_PLATFORM !== undefined;

/** @type {import('@sveltejs/kit').Adapter} */
function get_adapter() {
	if (IS_TAURI) {
		return adapter_static({
			strict: false,
			fallback: 'index.html',
			precompress: false
		});
	} else {
		return adapter_node({
			out: 'build',
			precompress: true
		});
	}
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: get_adapter(),
		alias: {
			$database: './src/database/',
			$components: './src/components',
			$lib: './src/lib',
			$stores: './src/stores',
			$utils: './src/utils',
			$styles: './src/styles',
			$assets: './src/assets',
			$scripts: './src/scripts',
			$schemas: './src/schemas',
			$config: './src/config'
		},
		serviceWorker: {
			register: false
		}
	}
};

export default config;
