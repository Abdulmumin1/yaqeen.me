<script>
	import { slide, scale, fade } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';
	let images = [
		'https://images.pexels.com/photos/6044185/pexels-photo-6044185.jpeg',
		'https://images.pexels.com/photos/5691695/pexels-photo-5691695.jpeg',
		'https://images.pexels.com/photos/4577525/pexels-photo-4577525.jpeg',
		'https://images.pexels.com/photos/4541011/pexels-photo-4541011.jpeg'
	];

	let currentIndex = 0;
	let image = images[currentIndex];
	let interval;
	onMount(() => {
		// Start the carousel
		interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
			image = images[currentIndex];
			// console.log(currentIndex);
		}, 3000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
	let cAnim = 'slidey';

	function change(event, anim) {
		console.log(event.target);
		cAnim = anim;
		clearInterval(interval);
		interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
			image = images[currentIndex];
			// console.log(currentIndex);
		}, 3000);
	}
</script>

<div class="w-full px-4 py-2 rounded-xl bg-orange-100 dark:bg-stone-900">Interactive demo</div>
<div
	class="container relative bg-orange-100 flex items-center justify-center gap-4 flex-col dark:bg-stone-900 rounded-3xl"
>
	<!-- some randome text -->
	<div class="flex flex-col md:flex-row gap-4 items-center justify-center">
		<div class="flex flex-col gap-4">
			<h4 class="title">Carousel Demo</h4>
			<div class="flex flex-col gap-2">
				<button
					class="bg-orang dark:bg-dark rounded-xl text-black"
					on:click={(e) => {
						change(e, 'slidex');
					}}>Slide X</button
				>
				<button
					class="bg-orang dark:bg-dark rounded-xl text-black"
					on:click={(e) => {
						change(e, 'slidey');
					}}>Slide Y</button
				>
				<button
					class="bg-orang dark:bg-dark rounded-xl text-black"
					on:click={(e) => {
						change(e, 'scale');
					}}>Scale in</button
				>

				<button
					class="bg-orang dark:bg-dark rounded-xl text-black"
					on:click={(e) => {
						change(e, 'fade');
					}}>Fade in</button
				>
			</div>
		</div>
		<div class="center">
			{#if cAnim == 'slidex'}
				{#key image}
					<div in:slide={{ axis: 'x' }} out:slide={{ axis: 'y' }}>
						<img src={image} alt="" />
					</div>
				{/key}
			{:else if cAnim == 'slidey'}
				{#key image}
					<div transition:slide={{ axis: 'y' }}>
						<img src={image} alt="" />
					</div>
				{/key}
			{:else if cAnim == 'fade'}
				{#key image}
					<div in:fade={{ axis: 'x' }}>
						<img src={image} alt="" />
					</div>
				{/key}
			{:else if cAnim == 'scale'}
				{#key image}
					<div transition:scale={{ axis: 'x' }}>
						<img src={image} alt="" />
					</div>
				{/key}
			{/if}
		</div>
	</div>
	<p class="absolute bottom-0">*Current animation : {cAnim}</p>
</div>

<!-- <div>jgams</div> -->

<style>
	.title {
		padding: 10px;
		line-height: 0;
	}
	.container {
		/* background: orange; */
		height: 440px;
		width: 100%;
		padding: 20px;
	}
	img {
		/* background-color: orange; */
		width: 100%;
		/* height: 500px; */
		max-width: 500px;
		object-fit: contain;
	}

	.center {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 15px;
	}

	button {
		width: 100%;
		padding: 4px;
		transition: all 0.4s ease-in-out;
	}

	button:active {
		scale: 0.2;
	}
</style>
