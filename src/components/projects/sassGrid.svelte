<script>
	import Template from './template.svelte';
	import { sass_projects } from '$lib/utils/projectStore.js';
	import SassTemplate from './sassTemplate.svelte';
	// let data = [];
	// const unsubscribe_stack = project_data.subscribe((data) => (stack_dict = data));
	// unsubscribe_stack();
</script>

<div
	class="grid rounded-xl bg-orange-100 dark:bg-stone-900 grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden p-2 lg:p-5"
>
	{#each $sass_projects as project (project.name)}
		<SassTemplate details={project} />
	{/each}
</div>
