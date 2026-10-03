<script>
	import Card from '$lib/og/card.svelte';
	import Seo from '$components/general/seo.svelte';
	import { siteOrigin } from '$lib/js/config.js';

	/** Out of the layout and on to the end of the page, so nothing of the site's chrome can sit on top of it. */
	function onTop(node) {
		document.body.append(node);
		return { destroy: () => node.remove() };
	}
</script>

<svelte:head>
	<Seo
		title="OG Preview | Abdulmumin Yaqeen"
		description="Open Graph preview sandbox."
		canonical={`${siteOrigin}/og/preview`}
		robots="noindex, nofollow"
	/>
</svelte:head>

<!-- Laid over the whole page, nav and all, so a 1200 x 630 window shows the card and nothing else. -->
<div class="stage" use:onTop>
	<Card />
</div>

<style>
	.stage {
		position: fixed;
		inset: 0;
		z-index: 2000;
		overflow: auto;
		background: var(--color-surface);
	}
</style>
