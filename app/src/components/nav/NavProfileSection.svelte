<script lang="ts">
	import { getContext } from 'svelte';
	import {
		type ContextSessionDataType,
		type MaybeSessionData,
		SessionDataContext
	} from '$schemas/auth';
	import NavLoginButton from '$components/nav/NavLoginButton.svelte';
	import NavProfileMenu from '$components/nav/NavProfileMenu.svelte';

	const session_data_store = getContext<ContextSessionDataType>(SessionDataContext);
</script>

{#if $session_data_store}
	<NavProfileMenu session_data={$session_data_store} />
{:else}
	<NavLoginButton />
{/if}
