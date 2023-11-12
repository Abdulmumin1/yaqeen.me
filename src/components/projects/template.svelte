<script>
	import { scale } from 'svelte/transition';

	import { faAngleRight, faFolder, faFolderBlank } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let details;
	import { stackLinks } from '$lib/utils/stackLookup.js';
	//{'name':"Project Name", 'stack':['Stack1', 'Stack2', 'Stack3'], 'description':"a short sentence that gives a overall picture of the project"}

	// let stack_dict = {};

	// const unsubscribe_stack = stackLinks.subscribe((data) => (stack_dict = data));
	// unsubscribe_stack();
	function getRandomColor() {
		const colors = ['bg-orange-300'];

		const randomIndex = Math.floor(Math.random() * colors.length);
		return colors[randomIndex];
	}
</script>

<div
	in:scale
	class="border rounded-2xl border-orang gap-2 border-b-2 dark:border-dark p-6 flex flex-col w-full max-h-screen hover:border-b-4 transition-all duration-100 bg-orange-100 dark:bg-stone-900"
>
	<div class="flex gap-2 items-center">
		<p class="text-4xl lg:text-5xl">{details.name}</p>
		<!-- <p class="text-orang dark:text-dark text-2xl lg:text-[2.5rem]">
			<Fa icon={faFolderBlank} />
		</p> -->
	</div>
	<div class="space-x-3 grid lg:grid-cols-2 grid-cols-1 items-center">
		<!-- <div>
			<img src={edit} alt="" class="h-full rounded-md" />
		</div> -->
		<div class="space-y-3">
			<p class="text-stone-900 dark:text-orange-100">{details.description}</p>
			<ul class="flex gap-2 flex-wrap text-black">
				<!-- {#each details.stack as stack}
					<li class=" text-orang dark:text-dark bg-orang dark:bg-dark p-1 rounded-md">
						<a href={$stackLinks[stack.toLowerCase()]} class="text-orang dark:text-dark">{stack}</a>
					</li>
				{/each} -->
			</ul>

			<div class="flex space-x-2">
				<div
					class="flex items-center w-fit space-x-2 p-1 rounded-lg border hover_link_fill border-orang dark:border-dark"
				>
					<a href={details.links.study} class="">Github </a>
				</div>
				<div
					class="flex items-center w-fit space-x-2 p-1 rounded-lg border border-orang hover_link_fill dark:border-dark"
				>
					<a href={details.links.page} class="">Visit</a>
					<Fa icon={faAngleRight} />
				</div>
			</div>
		</div>
	</div>
</div>
