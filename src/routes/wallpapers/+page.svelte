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

<div class=" mt-3 mb-2 px-2 flex gap-5 flex-col">
	<div class="w-full flex items-center flex-col">
		<h2 class="text-2xl border border-orang dark:border-dark p-2 w-fit rounded-md">
			Eid Mubarak Folks! 🫱🏼‍🫲🏽
		</h2>
		<p>if the download button doesn't work, kindly long press the image.</p>
		<p>I couldn't get it fixed on time</p>
	</div>

	<div class="flex flex-wrap gap-5 justify-center">
		{#each $wallpapers as wall (wall)}
			<Card {wall} />
		{/each}
	</div>
</div>
