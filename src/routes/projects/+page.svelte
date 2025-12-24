<script>
	import Template from '../../components/projects/template.svelte';
	import { project_data, sass_projects } from '$lib/utils/projectStore.js';
	import Seo from '../../components/general/seo.svelte';

	const mini_projects = [
		{
			name: 'CSS-Faster',
			description:
				'a vscode extension that allows you to write vanilla css faster, using tailwind classes as snippets',
			links: { study: 'https://github.com/Abdulmumin1/css-faster' },
			imagelist: []
		},
		{
			name: 'TailwindPie',
			description:
				'A python package that makes it easier to setup and use tailwind in any python project',
			links: { study: 'https://github.com/Abdulmumin1/tailwindpie' },
			imagelist: []
		},
		{
			name: 'SleekScroll',
			description: 'A chromium browser extension that makes ugly scrollbar customizable',
			links: { study: 'https://github.com/Abdulmumin1/sleekscroll' },
			imagelist: []
		},
		{
			name: 'Filesafe',
			description:
				'a secure file storage commandline tool to hide/encrypt files. (In a weird way 😀)',
			links: { study: 'https://github.com/Abdulmumin1/Yt-filesafe' },
			imagelist: []
		},
		{
			name: 'Xologic',
			description:
				'A python package for tictactoe board logic, which can be used to evaluate board and activities',
			links: { study: 'https://github.com/Abdulmumin1/xologic' },
			imagelist: []
		},
		{
			name: 'Mini Discord - Desktop app',
			description: 'A Discord kind off chat room built with socket and PyQt5',
			links: { study: 'https://github.com/Abdulmumin1/ChatDesktopApp' },
			imagelist: []
		}
	];
</script>

<svelte:head>
	<Seo title="Projects" description="A collection of the projects i've completed over the years" />
</svelte:head>

<div class="grid place-items-center w-full p-4 md:px-0">
	<div class="flex gap-4 flex-col max-w-[1200px] w-full relative">
		<div class="w-full md:rounded-2xl space-y-5 p-1 py-6 lg:p-6 flex flex-col" id="projects">
			<h2
				class="lg:text-5xl text-4xl text-center font-visby_bold font-bold pb-3 text-orang dark:text-dark"
			>
				All Projects
			</h2>
			<div
				class="grid bg-orange-100 grid-cols-1 rounded-lg divide-y divide-y-3 divide-orange-300 dark:divide-stone-700 overflow-hidden p-2 lg:p-5 dark:bg-stone-900"
			>
				{#each [...$sass_projects, ...$project_data, ...mini_projects] as project (project.name)}
					<Template details={project} />
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	::-webkit-scrollbar {
		height: 0;
		width: 0;
	}

	.scroll-container {
		scroll-snap-type: y mandatory; /* Define vertical scroll snap behavior */
	}

	.scroll-item {
		scroll-snap-align: start;
		transition: transform 0.3s ease;
	}
</style>
