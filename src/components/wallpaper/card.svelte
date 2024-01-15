<script>
	import { faDownload, faShareAlt } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let wall;

	// let fileUrl = 'https://url.com/image.png';

	function downloadFile() {
		const link = document.createElement('a');
		link.href = wall;
		link.download = wall.substring(wall.lastIndexOf('/') + 1);
		link.click();
	}
</script>

<div
	class="border space-y-3 border-b-4 bg-orange-200 border-orang dark:border-dark p-2 dark:bg-stone-900 transition-transform duration-300 transform hover:scale-105 rounded-lg max-w-sm"
>
	<a href={wall}>
		<img src={wall} alt="Eid Mubarak wallpaper" loading="lazy" class="rounded-lg" />
	</a>
	<div class="flex space-x-2 items-center justify-end text-xl">
		<button
			on:click={downloadFile}
			class="border hover:bg-orang dark:hover:bg-stone-800 px-5 py-2 rounded-lg border-orang dark:border-dark"
		>
			<!-- <button on:click={downloadFile}> -->
			<Fa icon={faDownload} />
			<!-- </button> -->
		</button>
		<button
			class="border hover:bg-orang dark:hover:bg-stone-800 px-5 py-2 rounded-lg border-orang dark:border-dark"
		>
			<Fa icon={faShareAlt} />
		</button>
	</div>
</div>
