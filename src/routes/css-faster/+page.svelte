<script>
	import { slide } from 'svelte/transition';
	import Fa from 'svelte-fa';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import Seo from '../../components/general/seo.svelte';

	const project = {
		name: 'CSS-Faster',
		description: 'Write vanilla CSS faster using Tailwind classes as snippets',
		tagline: 'Supercharge your CSS workflow in VS Code',
		repoUrl: 'https://github.com/Abdulmumin1/css-faster',
		vsCodeMarketplace:
			'https://marketplace.visualstudio.com/items?itemName=YourPublisherName.css-faster', // Replace with actual marketplace URL
		features: [
			'Tailwind-inspired snippets for vanilla CSS',
			'Instant CSS property suggestions',
			'Customizable snippets',
			'Works with any CSS file'
		],
		demoGif: '/css-faster/vid.gif' // Replace with actual demo GIF URL
	};
</script>

<svelte:head>
	<Seo title={project.name} description={project.description} />
</svelte:head>

<div class="min-h-screen p-6 text-gray-900 dark:text-white" in:slide>
	<header class="text-center mb-12 flex flex-col gap-4">
		<h1 class="text-6xl font-bold mb-4 mt-6">{project.name}</h1>
		<p class="text-2xl text-orang dark:text-dark">{project.tagline}</p>
	</header>

	<main class="max-w-4xl mx-auto flex gap-6 flex-col">
		<section class="mb-16 flex gap-4 flex-col">
			<p class="text-xl mb-8 text-center">{project.description}</p>
			<div class="flex justify-center gap-4">
				<a
					href={project.vsCodeMarketplace}
					target="_blank"
					rel="noopener noreferrer"
					class="bg-orang dark:bg-dark flex gap-2 items-center p-3 rounded-lg text-white hover:opacity-90 transition-opacity"
				>
					Install Extension
				</a>
				<a
					href={project.repoUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="bg-orange-200 dark:bg-stone-800 flex gap-2 items-center p-3 rounded-lg hover:opacity-90 transition-opacity"
				>
					<Fa icon={faGithub} /> View on GitHub
				</a>
			</div>
		</section>

		<section class="mb-16">
			<h2 class="text-3xl font-semibold mb-6 text-center">How It Works</h2>
			<div class="border-4 border-orange-200 dark:border-dark rounded-xl overflow-hidden">
				<img src={project.demoGif} alt="CSS-Faster demo" class="w-full" />
			</div>
		</section>

		<section class="mb-16">
			<h2 class="text-3xl font-semibold mb-6 text-center">Features</h2>
			<ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each project.features as feature}
					<li class="bg-orange-100 dark:bg-stone-800 p-4 rounded-lg flex items-center">
						<!-- <Fa icon={faVscode} class="text-orang dark:text-dark mr-3" /> -->
						<span>{feature}</span>
					</li>
				{/each}
			</ul>
		</section>

		<!-- <section class="text-center">
			<h2 class="text-3xl font-semibold mb-6">Get Started Today</h2>
			<a
				href={project.vsCodeMarketplace}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-block bg-orang dark:bg-dark p-3 rounded-lg text-white hover:opacity-90 transition-opacity"
			>
				Install CSS-Faster
			</a>
		</section> -->
	</main>
</div>
