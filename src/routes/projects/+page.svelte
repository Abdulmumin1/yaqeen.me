<script>
	import { project_data } from '$lib/utils/projectStore.js';
	import Fa from 'svelte-fa';
	import ProjectOverview from '../../components/projects/projectOverview.svelte';
	import { faAngleLeft, faAngleRight, faRightLong } from '@fortawesome/free-solid-svg-icons';
	import { scale } from 'svelte/transition';

	let alternate = true;
	let projectData = $project_data;
	let currentView = 0;

	function changLoc(p) {
		window.location.href = `#${p.name}`;
		currentView = projectData.indexOf(p);
	}
	function changLocN() {
		if (currentView < projectData.length - 1) {
			currentView++;
		} else {
			currentView = 0;
		}
		window.location.href = `#${projectData[currentView].name}`;
		console.log(projectData);
	}

	function changLocR() {
		if (currentView > 0) {
			currentView--;
			// console.log('removed');
		} else {
			currentView = projectData.length - 1;
		}
		console.log(currentView);
		window.location.href = `#${projectData[currentView].name}`;
		console.log(projectData);
	}
</script>

<!-- <p class="text-center">Under Construction</p> -->
<div class="grid place-content-center">
	<div class="flex max-w-[1200px]">
		<div class="w-[200px] relative">
			<div
				class="grid fixed mt-[10rem] top-0 place-items-center bg-orange-100 rounded-lg dark:bg-stone-900 p-12"
			>
				<div class="flex flex-col gap-2 justify-center p-2">
					{#each $project_data as p}
						<button
							class="text-md md:text-xl p-2 flex gap-2"
							class:text-orang={p.name == projectData[currentView].name}
							on:click={() => changLoc(p)}><Fa icon={faRightLong} />{p.name}</button
						>
					{/each}
				</div>
			</div>
		</div>

		<div class="relative scroll-container overflow-y-hidden w-screen gap-4 overflow-x-scroll">
			{#each projectData as project (project.name)}
				<div class="w-fit scroll-item">
					<ProjectOverview details={project} {alternate} />
				</div>
			{/each}
		</div>
	</div>

	<!--
	<button
		class="absolute hidden md:flex justify-start items-center right-0 my-auto inset-y-0 p-4 text-xl"
		on:click={() => changLocN()}><Fa icon={faAngleRight} /></button
	>
	<button
		class="absolute hidden md:flex justify-end items-center left-0 my-auto inset-y-0 p-4 text-xl"
		on:click={() => changLocR('g')}><Fa icon={faAngleLeft} /></button
	> -->

	<div class="border border-orang dark:border-dark" />
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
