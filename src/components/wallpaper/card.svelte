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
	class="flex flex-col gap-3 group transition-opacity duration-300"
	class:opacity-50={!imageLoaded}
>
	<div class="relative overflow-hidden rounded-lg bg-surface-muted">
		<img
			src={wall}
			alt="Wallpaper"
			class="w-full h-auto object-cover transition-all duration-700 group-hover:scale-[1.02]"
			class:opacity-0={!imageLoaded}
			onload={() => (imageLoaded = true)}
		/>

		<div
			class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
		></div>
	</div>

	<div class="flex items-center justify-between">
		<div class="flex flex-col">
			<p class="text-[10px] font-mono text-text-muted uppercase tracking-widest">/artwork</p>
			<p class="text-xs text-text-muted">Wallpaper Concept</p>
		</div>

		<div class="flex gap-2">
			<button
				onclick={downloadFile}
				class="p-2 text-xs text-text-muted hover:text-primary transition-colors"
				title="Download"
			>
				<Fa icon={faDownload} />
			</button>
			<button
				onclick={shareWallpaper}
				class="p-2 text-xs text-text-muted hover:text-primary transition-colors"
				title="Share"
			>
				<Fa icon={faShareAlt} />
			</button>
		</div>
	</div>
</div>
