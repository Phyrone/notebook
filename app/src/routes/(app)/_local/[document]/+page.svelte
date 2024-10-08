<script lang="ts">
	import { JSONEditor } from 'svelte-jsoneditor';
	import type { PageData } from './$types';
	import type { PouchDbDocumentWritable } from '$scripts/pouch_writable';
	import NDocumentView from '$components/doc/NDocumentView.svelte';

	export let data: PageData;
	let document_data_store: PouchDbDocumentWritable<any> = data.document_store;

	function new_document() {
		document_data_store.set({});
	}

	function delete_document() {
		document_data_store.set(undefined);
	}
</script>

<NDocumentView bind:doc={$document_data_store} read_only={false} />
