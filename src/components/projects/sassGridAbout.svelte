<script>
	import Template from './template.svelte';
	import { sass_projects } from '$lib/utils/projectStore.js';
	import SassTemplate from './sassTemplate.svelte';
	// let data = [];
	// const unsubscribe_stack = project_data.subscribe((data) => (stack_dict = data));
	// unsubscribe_stack();
</script>

<div class="grid rounded-xl grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden">
	{#each $sass_projects as project (project.name)}
		<SassTemplate details={project} />
	{/each}
</div>
