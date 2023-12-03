<script>
	import { listen } from 'svelte/internal';
	import ImageCarousel from './imageCarousel.svelte';

	export let details;

	let list = ['/dummy1.png', '/dummy2.png', '/dummy3.png', '/dummy4.png'];

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	list = shuffleArray(list);
</script>

<div class="snap-mandatory h-screen h-[100dvh] p-2 md:p-12" id={details.name}>
	<div class="   h-full border-orang dark:border-dark rounded-xl flex items-center justify-center">
		<div class="flex flex-col md:flex-row gap-10 items-start md:items-center justify-center p-12">
			<ImageCarousel imageList={list} />
			<div class="details max-w-md min-w-[300px]">
				<h1
					class="text-4xl font-bold font-visby_bold hover:text-orang hover:dark:text-dark transition-colors duration-300"
				>
					<a href={details.links.page}>{details.name}</a>
				</h1>
				<p>{details.description}</p>
			</div>
		</div>
	</div>
</div>
