<script lang="ts">
	import type { NDocumentV1, NDocumentV1Element } from '$schemas/schema_doc_v1';
	import NDocumentV1TextElement from '$components/doc/doc1/NDocumentV1TextElement.svelte';
	import { nanoid } from 'nanoid';

	export let doc: NDocumentV1;
	export let element: NDocumentV1Element;
	export let read_only: boolean = false;
	export let position: number;
</script>

{#if element.type === 'text'}
	<NDocumentV1TextElement {position} bind:doc bind:element bind:read_only />
{:else}
	<p>Element type not supported yet</p>
{/if}
