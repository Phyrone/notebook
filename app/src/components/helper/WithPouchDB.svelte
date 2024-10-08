<script lang="ts">
	import PouchDB from 'pouchdb';
	import { onDestroy, onMount, setContext } from 'svelte';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';

	export let name: string;

	const database = writable();
	setContext('pouchdb', database);

	onMount(() => {});
</script>

<slot />
