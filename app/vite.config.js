import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

const host = process.env.TAURI_DEV_HOST;
const IS_TAURI = process.env.TAURI_ENV_PLATFORM !== undefined;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
	plugins: [sveltekit()],

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent vite from obscuring rust errors
	clearScreen: !IS_TAURI,
	// 2. tauri expects a fixed port, fail if that port is not available
	server: {
		port: IS_TAURI ? 1420 : undefined,
		strictPort: IS_TAURI,
		host: host || false,
		hmr: host
			? {
					protocol: 'ws',
					host,
					port: 1421
				}
			: undefined,
		watch: {
			// 3. tell vite to ignore watching `src-tauri`
			ignored: ['**/src-tauri/**']
		},
		proxy: {
			'/test1/': 'http://admin:123456@127.0.0.1:5984/'
		}
	},

	define: { global: 'window' }
}));
