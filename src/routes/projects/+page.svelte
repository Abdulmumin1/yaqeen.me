<script>
	import { project_data } from '$lib/utils/projectStore.js';
	import ProjectOverview from '../../components/projects/projectOverview.svelte';

	let alternate = true;
</script>

<div class=" snap-both w-screen gap-4 flex overflow-scroll">
	{#each $project_data as project}
		<div class="w-fit">
			<ProjectOverview details={project} {alternate} />
		</div>
	{/each}

	<!-- <div class=""> -->
	<!-- <ProjectOverview details={$project_data[2]} {alternate} /> -->
	<!-- </div> -->
</div>

<style>
	::-webkit-scrollbar {
		height: 0;
		width: 0;
	}
</style>
