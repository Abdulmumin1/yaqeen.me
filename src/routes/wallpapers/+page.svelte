<script>
	import Card from '../../components/wallpaper/card.svelte';
	import { wallpapers } from '$lib/utils/randomstore.js';
	import { scale, slide } from 'svelte/transition';
	import Seo from '../../components/general/seo.svelte';
	import { onMount } from 'svelte';

	let containerRef;

	function adjustGrid() {
		if (containerRef) {
			const children = containerRef.children;
			for (let child of children) {
				child.style.gridRowEnd = `span ${Math.ceil(child.getBoundingClientRect().height / 10)}`;
			}
		}
	}

	onMount(() => {
		const resizeObserver = new ResizeObserver(adjustGrid);

		if (containerRef) {
			resizeObserver.observe(containerRef);
		}

		return () => resizeObserver.disconnect();
	});

	function handleShareAttempt(event) {
		const url = event.detail.url;
		// Implement a fallback sharing method here
	}
</script>

<svelte:head>
	<Seo
		title="Wallpapers - Abdulmumin Yaqeen"
		description="A collection of some cool wallpaper I created and use"
	/>
</svelte:head>

<div in:scale out:slide class="mt-3 mb-2 px-2 flex gap-5 flex-col">
	<div bind:this={containerRef} class="masonry-grid">
		{#each $wallpapers as wallUrl (wallUrl)}
			<div class="masonry-item">
				<Card wall={wallUrl} on:shareAttempt={handleShareAttempt} on:load={adjustGrid} />
			</div>
		{/each}
	</div>
</div>

<style>
	.masonry-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		grid-auto-rows: 10px; /* Set initial height */
		grid-gap: 15px;
	}

	.masonry-item {
		break-inside: avoid;
		transition: transform 0.3s ease-in-out;
	}

	.masonry-item:hover {
		transform: scale(1.03);
	}

	@media screen and (max-width: 600px) {
		.masonry-grid {
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		}
	}
</style>
