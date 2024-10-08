import daisyui from 'daisyui';
import tailwindcss_container_queries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [tailwindcss_container_queries, daisyui]
};
