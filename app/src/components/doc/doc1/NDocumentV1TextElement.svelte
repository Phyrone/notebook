<script lang="ts">
	import type {
		NDocumentV1,
		NDocumentV1Element,
		NDocumentV1ElementText
	} from '$schemas/schema_doc_v1';

	export let position: number;

	export let doc: NDocumentV1;
	export let element: NDocumentV1ElementText;
	export let read_only: boolean = false;

	function remove_element() {
		doc.elements = doc.elements.filter((e) => e.id !== element.id);
	}
</script>

<div class="w-full">
	{position}<input class="w-full" bind:value={element.value} />
</div>
<button on:click={remove_element} class="btn btn-error">-</button>
