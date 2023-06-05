<script>
	import Template from './template.svelte';
	import { project_data } from '../utils/projectStore.js';
	// let data = [];
	// const unsubscribe_stack = project_data.subscribe((data) => (stack_dict = data));
	// unsubscribe_stack();
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden p-2 lg:p-5">
	{#each $project_data as project (project.name)}
		<Template details={project} />
	{/each}
</div>
