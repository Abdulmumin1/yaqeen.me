<script>
	import { slide } from 'svelte/transition';
	import { project_data_main } from '$lib/utils/projectStore.js';
	import BigProject from './bigProject.svelte';
</script>

<div
	class="flex flex-col w-full items-center gap-6 bg-orange-100 dark:bg-stone-900 mt-2 p-4 py-6 lg:p-8 rounded-3xl"
>
	<h3 class="text-4xl font-bold text-orang dark:text-dark">Projects</h3>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
		{#each $project_data_main as project}
			<BigProject
				title={project.name}
				link={project.links.page}
				description={project.description}
				stack={project.stack}
			/>
		{/each}
	</div>
</div>
