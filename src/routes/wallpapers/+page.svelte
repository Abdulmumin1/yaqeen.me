<script>
	import Card from '../../components/wallpaper/card.svelte';
	import { wallpapers } from '$lib/utils/randomstore.js';
	import { scale } from 'svelte/transition';
	import Seo from '../../components/general/seo.svelte';

	function handleShareAttempt(event) {
		const url = event.detail.url;
		// Fallback copy to clipboard could go here
	}
</script>

<svelte:head>
	<Seo
		title="Wallpapers - Abdulmumin Yaqeen"
		description="A collection of some cool wallpaper I created and use"
	/>
</svelte:head>

<div in:scale class="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
	<div class="flex flex-col gap-2">
		<p class="text-[9px] font-mono uppercase tracking-[0.3em] opacity-30">/wallpapers</p>
		<h1 class="text-sm font-bold text-primary uppercase tracking-widest">Digital Art</h1>
	</div>

	<div class="flex flex-col gap-12">
		{#each $wallpapers as wallUrl (wallUrl)}
			<Card wall={wallUrl} on:shareAttempt={handleShareAttempt} />
		{/each}
	</div>
</div>
