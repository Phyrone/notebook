<script lang="ts">
	import type { LayoutData } from './$types';
	import { onDestroy } from 'svelte';

	export let data: LayoutData;
	onDestroy(() => {
		data.database.compact().then(() => data.database.close());
	});
</script>

<slot />
