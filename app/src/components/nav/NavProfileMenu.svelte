<script lang="ts">
	import { User } from 'lucide-svelte';
	import type { SessionData } from '$schemas/auth';

	export let session_data: SessionData;
</script>

<button>
	<User />
</button>
