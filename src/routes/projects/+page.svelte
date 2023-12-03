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
	<div class="flex max-w-[1200px] relative">
		<div
			class="w-[399px] hidden md:flex sticky top-[100px] h-fit mt-[150px] bg-orange-100 dark:bg-stone-900 rounded-2xl"
		>
			<div class="grid place-items-center p-12">
				<div class="flex flex-col gap-2 justify-center p-2 sticky">
					{#each $project_data as p}
						<button
							class="text-md tmd:text-xl p-2 flex gap-2 items-center j"
							class:text-orang={p.name == projectData[currentView].name}
							on:click={() => changLoc(p)}
						>
							<!-- Uploaded to: SVG Repo, www.svgrepo.com, Transformed by: SVG Repo Mixer Tools -->
							<svg
								width="20px"
								height="20px"
								viewBox="0 0 24.00 24.00"
								fill="l"
								xmlns="http://www.w3.org/2000/svg"
								transform="rotate(90)"
							>
								<g id="SVGRepo_bgCarrier" stroke-width="0" />

								<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

								<g id="SVGRepo_iconCarrier">
									<g id="Interface / Line_L">
										<path
											id="Vector"
											d="M12 19V5"
											stroke="#000000"
											stroke-width="0.8640000000000001"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="dark:stroke-orange-200"
										/>
									</g>
								</g>
							</svg>
							{p.name}</button
						>
					{/each}
				</div>
			</div>
		</div>

		<div class="relative w-full scroll-container gap-4 overflow-y-scroll">
			{#each projectData as project (project.name)}
				<div class="w-full scroll-item">
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
</div>

<!-- <div class="border border-orang dark:border-dark" /> -->

<style>
	::-webkit-scrollbar {
		height: 0;
		width: 0;
	}

	.scroll-container {
		scroll-snap-type: y mandatory; /* Define vertical scroll snap behavior */
	}

	.scroll-item {
		scroll-snap-align: start;
		transition: transform 0.3s ease;
	}
</style>
