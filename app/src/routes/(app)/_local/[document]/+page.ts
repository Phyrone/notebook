import type { PageLoad } from './$types';
import { NDocument } from '$schemas/schema_doc';
import { z } from 'zod';

export const load: PageLoad = async ({ parent, params: { document: document_id } }) => {
	let parent_data = await parent();

	const pouchDbWritable = await import('$scripts/pouch_writable').then(
		(module) => module.pouchDbWritable
	);

	let document_store = pouchDbWritable(parent_data.database, document_id);

	return {
		...parent_data,
		document_store,
		params: {
			document_id
		}
	};
};
