<script>
	import { scale } from 'svelte/transition';
	import { getModalContext, getCurrentProjectInModal } from '$lib/utils/projectStore';
	import { darkMode } from '$lib/utils/darkmode.js';

	import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let details;

	let modalContext = getModalContext();
	let currentProject = getCurrentProjectInModal();

	function openModal() {
		$currentProject = details;
		$modalContext = true;
	}
	function getRandomColor() {
		const colors = ['bg-orange-300'];

		const randomIndex = Math.floor(Math.random() * colors.length);
		return colors[randomIndex];
	}
</script>

<div
	in:scale
	class="border rounded-2xl border-orang gap-2 border-b-2 dark:border-dark p-6 flex flex-col w-full max-h-screen transition-all duration-100 bg-orange-100 dark:bg-stone-900"
>
	<div class="flex gap-2 items-center">
		<p class="text-orang dark:text-dark text-2xl lg:text-[2.5rem]">
			{#if $darkMode}
				<img height="50px" width="50px" src={details.svgdark} alt="" />
			{:else}
				<img height="50px" width="50px" src={details.svg} alt="" />
			{/if}
		</p>
		<p class="text-3xl lg:text-4xl mb-1 text-orang font-bold dark:text-dark">{details.name}</p>
	</div>
	<div class="space-x-3 grid grid-cols-1 items-center">
		<!-- <div>
			<img src={edit} alt="" class="h-full rounded-md" />
		</div> -->
		<div class="space-y-3">
			<p class="text-stone-900 max-w-[15rem] dark:text-orange-100">{details.description}</p>
			<!-- <ul class="flex gap-2 flex-wrap text-black">
				{#each details.stack as stack}
					<li class=" text-orang dark:text-dark bg-orang dark:bg-dark p-1 rounded-md">
						<a href={$stackLinks[stack.toLowerCase()]} class="text-orang dark:text-dark">{stack}</a>
					</li>
				{/each}
			</ul> -->

			<div class="flex space-x-2">
				<div
					class="flex items-center justify-center w-fit space-x-2 font-extrabold rounded-lg text-orang text-sm dark:text-dark"
				>
					<a target="_blank" href="https://{details.links.page}">{details.links.page}</a>
					<Fa icon={faExternalLinkAlt} />
				</div>
				<button class="" on:click={openModal}> Learn more </button>
			</div>
		</div>
	</div>
</div>

<!-- 
<style>
    #f97316
    #ea580c
    #c2410c
</style> -->
