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
	<Seo title="Projects" description="A growing collection of projects, tools, and experiments built by Abdulmumin Yaqeen — from developer utilities to full-stack applications." />
</svelte:head>

<div class="max-w-2xl mx-auto px-6 py-8">
	<div class="flex flex-col gap-6">
		<p class="text-[9px] font-mono uppercase tracking-[0.3em] text-text-muted">/stuff-i've-built</p>

		<div class="flex flex-col divide-y divide-primary/10">
			{#each [...$sass_projects, ...$project_data, ...mini_projects] as project (project.name)}
				<Template details={project} />
			{/each}
		</div>
	</div>
</div>
