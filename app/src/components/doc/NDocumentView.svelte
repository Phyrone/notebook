<script lang="ts">
	import { NDocument } from '$schemas/schema_doc';
	import NDocumentV1Render from '$components/doc/doc1/NDocumentV1Render.svelte';
	import NDocumentNewView from '$components/doc/NDocumentNewView.svelte';

	export let read_only: boolean = false;
	export let doc: NDocument | undefined;

	let valid_document: boolean | 'empty' = false;
	$: valid_document = doc ? NDocument.safeParse(doc).success : 'empty';

	function remove() {
		doc = undefined;
	}
</script>

{#if doc}
	<button class="btn btn-error" on:click={remove}>Remove</button>
{/if}

{#if !doc}
	<NDocumentNewView bind:doc {read_only} />
{:else if !valid_document}
	<!-- TODO better error message -->
	<h1>Invalid Document Schema</h1>
{:else if doc.type === 'doc1'}
	<NDocumentV1Render bind:doc {read_only} />
{/if}
