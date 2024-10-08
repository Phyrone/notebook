<script lang="ts">
	import type { i18n } from 'i18next';
	import { getContext, onDestroy, onMount } from 'svelte';

	export let key: string | any;
	export let props: Record<string, any> = {};

	let i18n = getContext<i18n>('i18n');

	let value: string;

	function refresh() {
		value = i18n.t(key, {
			...props,
			returnObjects: false
		});
	}

	$: value = i18n.t(key, {
		...props,
		returnObjects: false
	});
	onMount(() => {
		i18n.on('languageChanged', refresh);
		i18n.on('loaded', refresh);
		i18n.on('added', refresh);
	});

	onDestroy(() => {
		i18n.off('languageChanged', refresh);
		i18n.off('loaded', refresh);
		i18n.off('added', refresh);
	});
</script>

<slot {value}>{value}</slot>
