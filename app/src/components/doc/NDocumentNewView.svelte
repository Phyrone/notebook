<script lang="ts">
	import { NDocument } from '$schemas/schema_doc';
	import { NotebookTextIcon } from 'lucide-svelte';

	export let read_only: boolean = false;
	export let doc: NDocument | undefined;

	function create_new_document(type: NDocument['type']) {
		switch (type) {
			case 'doc1':
				console.log('Creating new doc1');
				doc = {
					title: 'New Document',
					schemaVersion: 1,
					type: 'doc1',
					elements: []
				};
				break;
		}
	}
</script>

<button class="btn btn-lg" on:click={() => create_new_document('doc1')}>
	<NotebookTextIcon />
</button>
