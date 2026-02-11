<script>
	import Template from './template.svelte';
	import { project_data } from '$lib/utils/projectStore.js';
	// let data = [];
	// const unsubscribe_stack = project_data.subscribe((data) => (stack_dict = data));
	// unsubscribe_stack();
</script>

<div class="grid grid-cols-1 divide-y divide-primary/10 w-full ">
	{#each $project_data.slice(0, 7) as project (project.name)}
		<Template details={project} />
	{/each}
</div>
