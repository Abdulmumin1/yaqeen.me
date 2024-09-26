<script>
	import { scale, slide } from 'svelte/transition';
	import Fa from 'svelte-fa';
	import { faApple, faWindows, faLinux } from '@fortawesome/free-brands-svg-icons';

	let imagelist = [
		'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331689/Screenshot_from_2024-09-26_07-16-45_fcufmv.png',
		'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331688/Screenshot_from_2024-09-26_07-16-51_umw5on.png',
		'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331686/Screenshot_from_2024-09-26_07-17-10_ekyrqm.png',
		'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331686/Screenshot_from_2024-09-26_07-17-22_msorwn.png',
		'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331682/Screenshot_from_2024-09-26_07-17-28_mf1dlm.png',
		'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331682/Screenshot_from_2024-09-26_07-17-42_biiqxb.png',
		'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331980/Screenshot_from_2024-09-26_07-25-39_vbxjrq.png'
	];
</script>

<div class="min-h-screen p-3 max-w-[1200px] mx-auto" in:slide>
	<article class="flex w-full p-6 h-[80vh] gap-4 justify-between items-center flex-col md:flex-row">
		<aside class="max-w-md w-full h-full">
			<div
				class=" h-full p-4 w-full rounded-lg shadow-xl dark:shadow-lg dark:shadow-stone-700 flex flex-col justify-between items-center"
			>
				<div
					class="border p-2 border-orang dark:border-dark rounded-lg flex justify-between items-center w-full"
				>
					<p>HighScore: 24</p>
					<p><Fa /></p>
				</div>

				<p>Numbers</p>

				<button class="w-full bg-orang shadow dark:bg-dark p-2 rounded-lg">play</button>
			</div>
		</aside>
		<section class="gap-2">
			<h1 class="text-6xl">BrainTime</h1>
			<p class="text-lg">Excell in you thinking ability with curated brain exercises</p>
		</section>
	</article>
	<div class="flex gap-4 p-4 overflow-x-auto mb-6">
		{#each imagelist as img, index}
			<img
				alt={`Project image ${index + 1}`}
				src={img}
				class="w-[720px] border-4 border-orange-200 dark:border-dark object-contain rounded-xl"
			/>
		{/each}
	</div>
	<!-- <div class="border-2 border-dotted border-orang dark:border-dark my-8" /> -->
	<div class="w-full px-4 flex flex-col justify-center items-center">
		<h3 class="text-3xl">Download</h3>

		<div class="flex justify-between text-xl py-5 flex-col max-w-lg md:flex-row">
			<div class="flex flex-col items-center shadow-lg p-4 rounded-md gap-4">
				<p>For Windows</p>
				<button class="bg-orang dark:bg-dark flex gap-2 items-center p-2 rounded-md"
					>Download <Fa icon={faWindows} class="" /></button
				>
			</div>

			<div class="flex flex-col items-center shadow-lg p-4 rounded-md gap-4">
				<p>For Mac</p>
				<button class="bg-orang dark:bg-dark flex gap-2 items-center p-2 rounded-md"
					>Download <Fa icon={faApple} class="" />
				</button>
			</div>

			<div class="flex flex-col items-center shadow-lg p-4 rounded-md gap-4">
				<p>For Linux</p>
				<button class="bg-orang dark:bg-dark flex gap-2 items-center p-2 rounded-md"
					>Download <Fa icon={faLinux} class="" /></button
				>
			</div>
		</div>
	</div>
</div>
