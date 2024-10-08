<script>
	import { HomeIcon } from 'lucide-svelte';
	import NavProfileSection from '$components/nav/NavProfileSection.svelte';
</script>

<nav
	style="--navbar-padding: 0.3rem"
	class="sticky top-0 z-30 bg-base-100 navbar shadow-sm min-h-11 h-11"
>
	<div class:navbar-start={true}>
		<a class="btn btn-sm btn-ghost" href="/">
			<HomeIcon />
		</a>
	</div>
	<div class:navbar-end={true}>
		<NavProfileSection />
	</div>
</nav>
