<script>
	import { faD } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import { fade, fly, scale, slide } from 'svelte/transition';

	let { imageList } = $props();

	let newImage = $state(0);
	let currentImage = $derived(imageList[newImage]);

	let interval;

	function switchImage(img) {
		let imageIndex = imageList.indexOf(img);
		// console.log(imageIndex);
		newImage = imageIndex;
		clearInterval(interval);
		// createInterval();
	}

	function createInterval() {
		interval = setInterval(() => {
			currentImage = imageList[newImage];
			newImage += 1;

			if (newImage >= imageList.length) {
				newImage = 0;
			}
		}, 3000);
	}
	onMount(() => {
		// createInterval();
	});
</script>

<div class="flex gap-4 items-center justify-center flex-col">
	<div class="w-full h-full max-w-4xl rounded-3xl transition-all duration-300">
		{#key currentImage}
			<img
				in:fly
				src={currentImage}
				style="aspect-ratio: 16/9;"
				alt=""
				class="object-contain rounded-3xl shadow-3xl transition-all duration-300"
			/>
		{/key}
	</div>
	<div class="w-80 flex items-center gap-2">
		{#each imageList as img}
			<div
				role="button"
				class="h-full w-full overflow-hidden rounded-lg border-orang dark:border-dark transition-all duration-300"
				onclick={() => {
					switchImage(img);
				}}
				class:border-2={currentImage == img}
			>
				<img src={img} alt="" class="object-contain rounded-lg" style="aspect-ratio: 16/9;" />
			</div>
		{/each}
	</div>
</div>
