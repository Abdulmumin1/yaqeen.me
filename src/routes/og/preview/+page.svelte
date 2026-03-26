<script>
	import Card from '$lib/og/card.svelte';
	import Seo from '$components/general/seo.svelte';
	import { siteOrigin } from '$lib/js/config.js';
</script>

<svelte:head>
	<Seo
		title="OG Preview | Abdulmumin Yaqeen"
		description="Open Graph preview sandbox."
		canonical={`${siteOrigin}/og/preview`}
		robots="noindex, nofollow"
	/>
</svelte:head>

<div class="min-h-screen cd">
	<Card />
</div>

<style>
	.cd {
		height: 630;
		width: 1200;
	}
</style>
