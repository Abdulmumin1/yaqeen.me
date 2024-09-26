<script>
	import { scale, slide } from 'svelte/transition';
	import Fa from 'svelte-fa';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';

	const project = {
		name: 'Drop',
		description:
			'A fast and secure desktop app that allows you to share files across multiple devices',
		links: {
			study: 'https://github.com/Abdulmumin1/drop',
			page: 'github.com/Abdulmumin1/drop'
		},
		stack: ['Qt', 'Flask', 'HTML', 'Socket', 'CSS2'],

		imagelist: [
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331682/Screenshot_from_2024-09-26_07-19-55_eq8esf.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331682/Screenshot_from_2024-09-26_07-20-00_lga9gf.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331691/Screenshot_2024-09-26_at_07-20-53_Drop_r3yltl.png'
		]
	};
</script>

<div class="min-h-screen p-3 max-w-[1200px] mx-auto" in:slide>
	<article
		class="flex w-full p-6 h-[80vh] gap-12 justify-between items-center flex-col md:flex-row"
	>
		<aside class="max-w-md w-full h-full">
			<div
				class="h-full p-4 w-full rounded-lg shadow-xl dark:shadow-lg dark:shadow-stone-700 flex flex-col justify-between items-center"
			>
				<div
					class="border p-2 border-orang dark:border-dark rounded-lg flex justify-between items-center w-full"
				>
					<p>Share files securely</p>
					<Fa icon={faGithub} />
				</div>
				<p>Drop</p>
				<a
					href={project.links.study}
					target="_blank"
					rel="noopener noreferrer"
					class="w-full bg-orang shadow dark:bg-dark p-2 rounded-lg text-center">View on GitHub</a
				>
			</div>
		</aside>
		<section class="gap-2">
			<h1 class="text-6xl">{project.name}</h1>
			<p class="text-lg">{project.description}</p>
			<div class="flex flex-wrap gap-2 mb-4">
				{#each project.stack as tech}
					<span class="px-2 py-1 bg-orange-200 dark:bg-stone-800 rounded-xl text-sm">{tech}</span>
				{/each}
			</div>
		</section>
	</article>
	<div class="flex gap-4 p-4 overflow-x-auto mb-6">
		{#each project.imagelist as img, index}
			<img
				alt={`Project image ${index + 1}`}
				src={img}
				class="w-[720px] border-4 border-orange-200 dark:border-dark object-contain rounded-xl"
			/>
		{/each}
	</div>
	<!-- <div class="w-full px-4 flex flex-col justify-center items-center">
		<h3 class="text-3xl">Get Started</h3>
		<div class="flex justify-between text-xl py-5 flex-col max-w-lg md:flex-row">
			<div class="flex flex-col items-center shadow-lg p-4 rounded-md gap-4">
				<p>Clone Repository</p>
				<a
					href={project.links.study}
					target="_blank"
					rel="noopener noreferrer"
					class="bg-orang dark:bg-dark flex gap-2 items-center p-2 rounded-md"
				>
					Clone <Fa icon={faGithub} class="" />
				</a>
			</div>
			<div class="flex flex-col items-center shadow-lg p-4 rounded-md gap-4">
				<p>View Documentation</p>
				<a
					href={project.links.page}
					target="_blank"
					rel="noopener noreferrer"
					class="bg-orang dark:bg-dark flex gap-2 items-center p-2 rounded-md"
				>
					Docs <Fa icon={faGithub} class="" />
				</a>
			</div>
		</div>
	</div> -->
</div>
