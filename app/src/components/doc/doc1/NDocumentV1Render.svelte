<script lang="ts">
	import type { NDocumentV1 } from '$schemas/schema_doc_v1';
	import { nanoid } from 'nanoid';
	import NDocumentV1ElementRender from '$components/doc/doc1/NDocumentV1ElementRender.svelte';
	import Editor from 'sveditorjs';

	export let read_only: boolean = false;
	export let doc: NDocumentV1;

	function add_element() {
		doc.elements = [
			...doc.elements,
			{
				id: nanoid(),
				type: 'text',
				value: ''
			}
		];
	}

	function position_of_element(element: any) {
		return doc.elements.indexOf(element);
	}
</script>

{#each doc.elements as element}
	<NDocumentV1ElementRender
		{read_only}
		position={position_of_element(element)}
		bind:doc
		bind:element
	/>
{/each}

<button class="btn btn-primary" on:click={add_element}>+</button>
