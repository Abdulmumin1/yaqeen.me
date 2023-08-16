<script>
	import Card from '../../components/wallpaper/card.svelte';
	import { wallpapers } from '$lib/utils/randomstore.js';
	import { scale, slide } from 'svelte/transition';
</script>

<svelte:head>
	<!-- Meta Tags Generated via https://www.opengraph.xyz -->

	<!-- HTML Meta Tags -->
	<title>Wallpapers - Abdulmumin Yaqeen</title>
	<meta name="description" content="Download beautiful 3D wallpapers" />
</svelte:head>

<div in:scale out:slide class=" mt-3 mb-2 px-2 flex gap-5 flex-col">
	<div class="w-full flex items-center flex-col">
		<h2 class="text-2xl border border-orang dark:border-dark p-2 w-fit rounded-md text-left">
			Eid Mubarak Folks! 🫱🏼‍🫲🏽
		</h2>
		<em>
			<p>If the download button doesn't work, <strong>kindly long press the image</strong>.</p>
			<p>I couldn't get it fixed before runnig out of time</p>
		</em>
	</div>

	<div class="flex flex-wrap gap-5 justify-center">
		{#each $wallpapers as wall (wall)}
			<Card {wall} />
		{/each}
	</div>
</div>
