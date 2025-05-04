<script>
	import { faDownload, faShareAlt } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { createEventDispatcher } from 'svelte';

	let { wall } = $props();

	const dispatch = createEventDispatcher();

	function downloadFile() {
		const link = document.createElement('a');
		link.href = wall;
		link.download = wall.substring(wall.lastIndexOf('/') + 1);
		link.click();
	}

	function shareWallpaper() {
		if (navigator.share) {
			navigator
				.share({
					title: 'Check out this wallpaper!',
					text: 'I found this amazing wallpaper. Take a look!',
					url: wall
				})
				.then(() => {
					console.log('Thanks for sharing!');
				})
				.catch(console.error);
		} else {
			dispatch('shareAttempt', { url: wall });
		}
	}

	let imageLoaded = $state(false);
</script>

<div
	class="border space-y-3 border-b-4 bg-orange-200 border-orang dark:border-dark p-2 dark:bg-stone-900 transition-all duration-300 rounded-lg max-w-sm overflow-hidden"
	class:opacity-50={!imageLoaded}
>
	<div class="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
		<!-- loading="lazy" -->
		<img
			src={wall}
			alt="Wallpaper"
			class="object-cover w-full h-full transition-opacity duration-300"
			class:opacity-0={!imageLoaded}
			onload={() => (imageLoaded = true)}
		/>
	</div>
	<div class="flex space-x-2 items-center justify-end text-xl">
		<button
			onclick={downloadFile}
			class="border hover:bg-orang dark:hover:bg-stone-800 px-5 py-2 rounded-lg border-orang dark:border-dark transition-colors duration-200"
		>
			<Fa icon={faDownload} />
		</button>
		<button
			onclick={shareWallpaper}
			class="border hover:bg-orang dark:hover:bg-stone-800 px-5 py-2 rounded-lg border-orang dark:border-dark transition-colors duration-200"
		>
			<Fa icon={faShareAlt} />
		</button>
	</div>
</div>
