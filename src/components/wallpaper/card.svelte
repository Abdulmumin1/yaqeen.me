<script>
	import {
		faCloudDownload,
		faCloudDownloadAlt,
		faDownload,
		faFileDownload,
		faShareAlt
	} from '@fortawesome/free-solid-svg-icons';
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
	class="border space-y-3 border-b-4 border-orang dark:border-dark p-2 dark:bg-[#111] transition-transform duration-300 transform hover:scale-105 rounded-lg max-w-sm"
>
	<a href={wall}>
		<img src={wall} alt="Eid Mubarak wallpaper" loading="lazy" />
	</a>
	<div class="flex space-x-2 items-center justify-end text-xl">
		<button
			on:click={downloadFile}
			class="border hover:bg-green-500 px-5 py-2 rounded-lg border-orang dark:border-dark hover:shadow-lg"
		>
			<!-- <button on:click={downloadFile}> -->
			<Fa icon={faDownload} />
			<!-- </button> -->
		</button>
		<button class="border hover:bg-green-600 px-5 py-2 rounded-lg border-orang dark:border-dark">
			<Fa icon={faShareAlt} />
		</button>
	</div>
</div>
