import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
	console.log('loading local database');
	const PouchDB = await import('pouchdb').then((m) => m.default);
	const database = new PouchDB(/* 'local'*/ 'local', {
		name: 'Local',
		auto_compaction: true,
		prefix: 'doc:'
	});

	return {
		database
	};
};
