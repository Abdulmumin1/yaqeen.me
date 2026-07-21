<script>
	import { onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';

	let { imageList } = $props();

	let newImage = $state(0);
	let currentImage = $derived(imageList[newImage]);

	let interval;

	function switchImage(img) {
		const imageIndex = imageList.indexOf(img);
		if (imageIndex !== -1) {
			newImage = imageIndex;
		}
		if (interval) {
			clearInterval(interval);
		}
	}

	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
		}
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
		{#each imageList as img (img)}
			<button
				type="button"
				class="h-full w-full overflow-hidden rounded-lg border-primary transition-all duration-300 cursor-pointer p-0 {currentImage ===
				img
					? 'border-2'
					: ''}"
				onclick={() => switchImage(img)}
			>
				<img src={img} alt="" class="object-contain rounded-lg" style="aspect-ratio: 16/9;" />
			</button>
		{/each}
	</div>
</div>
