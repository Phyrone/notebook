<script lang="ts">
	import NavContainers from '$components/nav/NavContainers.svelte';
	import type { LayoutData } from './$types';
	import { setContext } from 'svelte';
	import { SessionDataContext } from '$schemas/auth';
	import { I18NContext } from '$lib/locales';

	export let data: LayoutData;
	setContext(I18NContext, data.i18n);
	setContext(SessionDataContext, data.session_data);
</script>

<NavContainers>
	<slot />
</NavContainers>
