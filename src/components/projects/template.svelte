<script>
	import { scale } from 'svelte/transition';
	import { getModalContext, getCurrentProjectInModal } from '$lib/utils/projectStore';

	import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let details;
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
</script>

<div
	in:scale
	class="border rounded-2xl border-orang gap-2 border-b-2 dark:border-dark p-6 flex flex-col w-full max-h-screen transition-all duration-100 bg-orange-100 dark:bg-stone-900"
>
	<div class="flex gap-2 items-center">
		<p class="text-3xl lg:text-4xl">{details.name}</p>
		<!-- <p class="text-orang dark:text-dark text-2xl lg:text-[2.5rem]">
			<Fa icon={faFolderBlank} />
		</p> -->
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
					class="flex items-center justify-center w-fit space-x-2 px-2 rounded-lg border border-orang hover_link_fill text-sm dark:border-dark"
				>
					<a
						target={details?.onpage ? '_self' : '_blank'}
						href="{details?.onpage ? '' : 'https://'}{details.links.page}"
						>Visit {details.name.toLowerCase()}</a
					>
					<Fa icon={faArrowRightLong} />
				</div>
				<button class="" on:click={openModal}>Learn more</button>
			</div>
		</div>
	</div>
</div>
