<script>
	import { scale } from 'svelte/transition';
	import { getModalContext, getCurrentProjectInModal } from '$lib/utils/projectStore';

	import {
		faArrowRightLong,
		faExpand,
		faExpandAlt,
		faExternalLink,
		faExternalLinkAlt
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { onDestroy } from 'svelte';
	let { details } = $props();
	//{'name':"Project Name", 'stack':['Stack1', 'Stack2', 'Stack3'], 'description':"a short sentence that gives a overall picture of the project"}

	// let stack_dict = {};

	// const unsubscribe_stack = stackLinks.subscribe((data) => (stack_dict = data));
	// unsubscribe_stack();

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

	onDestroy(()=>{
		$modalContext = false;
	})
</script>

<div
	in:scale
	class="  border-orang gap-2 dark:border-dark flex flex-col w-full max-h-screen transition-all duration-100 bg-orange-50 px-5 py-4 dark:bg-stone-950 group"
>
	<div class="flex gap-2 items-center justify-between">
		<p class="text-2xl text-orang dark:text-dark">{details.name}</p>
		<!-- <p class="text-orang dark:text-dark text-2xl lg:text-[2.5rem]">
			<Fa icon={faFolderBlank} />
		</p> -->
		<div class="flex space-x-2 justify-end items-end gap-1">
			<!-- <div
					class="flex items-center justify-center w-fit space-x-2 px-2 rounded-lg border border-orang hover_link_fill text-sm dark:border-dark"
				>
					<a
						target={details?.onpage ? '_self' : '_blank'}
						href="{details?.onpage ? '' : 'https://'}{details.links.page}"
						>Visit {details.name.toLowerCase()}</a
					>
					<Fa icon={faArrowRightLong} />
				</div> -->
			{#if details.links.page}
				<!-- <button class="dark:text-orange-200/80 text-lg" onclick={openModal}
					><Fa icon={faExpand} /></button
				> -->
				<a
					class="dark:text-orange-200/80 text-base"
					title={`Link to ${details.name}`}
					href={`https://${details.links.page}`}
					target="_blank"><Fa icon={faExternalLinkAlt} /></a
				>
			{/if}
			{#if details.links.study}
				<a
					class="dark:text-orange-200/80 text-lg"
					href={details.links.study}
					target="_blank"
					title={`Github link for ${details.name}`}><Fa icon={faGithub} /></a
				>
			{/if}
		</div>
	</div>
	<div class="space-x-3 grid grid-cols-1 items-center">
		<!-- <div>
			<img src={edit} alt="" class="h-full rounded-md" />
		</div> -->
		<div class="space-y-3">
			<p class="text-stone-900 dark:text-orange-200/80">{details.description}</p>
			<!-- <ul class="flex gap-2 flex-wrap text-black">
				{#each details.stack as stack}
					<li class=" text-orang dark:text-dark bg-orang dark:bg-dark p-1 rounded-md">
						<a href={$stackLinks[stack.toLowerCase()]} class="text-orang dark:text-dark">{stack}</a>
					</li>
				{/each}
			</ul> -->

			{#if details.imagelist.length}
				<div class=" h-0 animate-h group-hover:h-48 gap-4 flex overflow-x-auto mb-6">
				{#each details.imagelist as img, index}
					<img
						alt={`Project image ${index + 1}`}
						onclick={openModal}
						src={img}
						class="w-[330px] border-4 border-orange-200 dark:border-dark object-contain rounded-xl"
					/>
				{/each}
			</div>
			{/if}
		</div>
	</div>
</div>


<style>
	.animate-h{
		  transition: height 0.5s cubic-bezier(.34,1.56,.64,1);
	}
</style>