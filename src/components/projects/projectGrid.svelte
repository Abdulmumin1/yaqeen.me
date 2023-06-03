<script>
	import Template from './template.svelte';
	let project_data = [
		{
			name: 'Edit',
			stack: ['Vanillajs', 'TailwindCSS', 'HTML'],
			description: 'Beautifully edit text and images',
			image: '$lib/static/images/edit.jpg'
		},
		{
			name: 'Numbertime',
			stack: ['Python', 'Flask', 'PyQt5'],
			description: 'A math game that helps you exale in your thinking ability'
		},
		{
			name: 'Quix',
			stack: ['Flask', 'Bootstrap', 'HTML', 'Javascript'],
			description: 'A math game that helps you exale in your thinking ability'
		}
	];
</script>

<div class="flex flex-col flex-wrap overflow-hidden p-2 lg:p-5 space-y-3">
	{#each project_data as project (project.name)}
		<Template details={project} />
	{/each}
</div>
