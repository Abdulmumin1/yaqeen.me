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
</script>

<div
	class="border space-y-3 border-b-4 border-orang dark:border-dark p-2 dark:bg-[#111] transition-transform duration-300 transform hover:scale-105 rounded-lg max-w-sm"
>
	<a href={wall}>
		<img src={wall} alt="Eid Mubarak wallpaper" loading="lazy" />
	</a>
	<div class="flex space-x-2 items-center justify-end text-xl">
		<button
			class="border hover:bg-green-500 px-5 py-2 rounded-lg border-orang dark:border-dark hover:shadow-lg"
		>
			<a href={wall} download="wallpaper-image">
				<Fa icon={faDownload} />
			</a>
		</button>
		<button class="border hover:bg-green-600 px-5 py-2 rounded-lg border-orang dark:border-dark">
			<Fa icon={faShareAlt} />
		</button>
	</div>
</div>
