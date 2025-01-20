<script>
	import Template from './template.svelte';
	import { project_data } from '$lib/utils/projectStore.js';
	// let data = [];
	// const unsubscribe_stack = project_data.subscribe((data) => (stack_dict = data));
	// unsubscribe_stack();
</script>

<div
	class="grid bg-orange-100 grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden p-2 lg:p-5 dark:bg-stone-900"
>
	{#each $project_data as project (project.name)}
		<Template details={project} />
	{/each}
</div>
