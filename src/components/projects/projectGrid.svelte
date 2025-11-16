<script>
	import Template from './template.svelte';
	import { project_data } from '$lib/utils/projectStore.js';
	// let data = [];
	// const unsubscribe_stack = project_data.subscribe((data) => (stack_dict = data));
	// unsubscribe_stack();
</script>

<div
	class="grid bg-orange-100 grid-cols-1 rounded-lg  divide-y divide-y-3 divide-orange-300 dark:divide-stone-700 overflow-hidden p-2 lg:p-5 dark:bg-stone-900"
>
	{#each $project_data.slice(0, 6) as project (project.name)}
		<Template details={project} />
	{/each}
</div>
