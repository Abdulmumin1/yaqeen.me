<script>
	import Card from '../../components/wallpaper/card.svelte';
	import { wallpapers } from '../../components/utils/randomstore.js';
</script>

<svelte:head>
	<!-- Meta Tags Generated via https://www.opengraph.xyz -->

	<!-- HTML Meta Tags -->
	<title>Wallpapers - Abdulmumin Yaqeen</title>
	<meta name="description" content="Download beautiful 3D wallpapers" />
</svelte:head>

<div class="flex flex-wrap gap-5 justify-center mt-3 mb-2 px-2">
	{#each $wallpapers as wall (wall)}
		<Card {wall} />
	{/each}
</div>
