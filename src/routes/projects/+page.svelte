<script>
	import { project_data } from '$lib/utils/projectStore.js';
	import ProjectOverview from '../../components/projects/projectOverview.svelte';

	let alternate = true;

	function changLoc(p) {
		window.location.href = `#${p}`;
	}
</script>

<!-- <p class="text-center">Under Construction</p> -->
<div class=" scroll-container overflow-y-hidden w-screen gap-4 flex overflow-x-scroll">
	{#each $project_data as project (project.name)}
		<div class="w-fit scroll-item">
			<ProjectOverview details={project} {alternate} />
		</div>
	{/each}

	<!-- <div class=""> -->
	<!-- <ProjectOverview details={$project_data[2]} {alternate} /> -->
	<!-- </div> -->
</div>

<div class="flex gap-2 items-center justify-center">
	{#each $project_data as p}
		<button class="w-20 h-20 bg-orang dark:bg-dark" on:click={() => changLoc(p.name)} />
	{/each}
</div>

<style>
	::-webkit-scrollbar {
		height: 0;
		width: 0;
	}

	.scroll-container {
		scroll-snap-type: x mandatory; /* Define vertical scroll snap behavior */
	}

	.scroll-item {
		scroll-snap-align: start;
		transition: transform 0.3s ease;
	}
</style>
