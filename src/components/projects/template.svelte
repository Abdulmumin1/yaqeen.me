<script>
	import { scale } from 'svelte/transition';

	import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let details;
	import { stackLinks } from '../utils/stackLookup.js';
	//{'name':"Project Name", 'stack':['Stack1', 'Stack2', 'Stack3'], 'description':"a short sentence that gives a overall picture of the project"}
	import edit from '$lib/images/edit.png';

	// let stack_dict = {};

	// const unsubscribe_stack = stackLinks.subscribe((data) => (stack_dict = data));
	// unsubscribe_stack();
	function getRandomColor() {
		const colors = [
			'bg-red-300',
			'bg-orange-300',
			'bg-yellow-300',
			'bg-green-300',
			'bg-teal-300',
			'bg-blue-300',
			'bg-indigo-300',
			'bg-purple-300',
			'bg-pink-300',
			'bg-gray-300'
		];

		const randomIndex = Math.floor(Math.random() * colors.length);
		return colors[randomIndex];
	}
</script>

<div
	in:scale
	class="border border-black dark:border-[#333] rounded-md p-6 flex flex-col w-full max-h-screen"
>
	<div>
		<h2 class="text-4xl lg:text-6xl">{details.name}</h2>
	</div>
	<div class="space-x-3 grid lg:grid-cols-2 grid-cols-1 items-center">
		<!-- <div>
			<img src={edit} alt="" class="h-full rounded-md" />
		</div> -->
		<div class="space-y-3">
			<p class="text-stone-500">{details.description}</p>
			<ul class="flex space-x-2 text-black">
				{#each details.stack as stack}
					<li class="border border-black {getRandomColor()} p-1 rounded-md">
						<a href={$stackLinks[stack.toLowerCase()]}>{stack}</a>
					</li>
				{/each}
			</ul>

			<div class="flex space-x-2">
				<div
					class="flex items-center w-fit space-x-2 p-1 rounded-lg border border-black hover:shadow-xl dark:border-[#333]"
				>
					<a href="#" class="hover_link_fill">Case study </a>
				</div>
				<div
					class="flex items-center w-fit space-x-2 p-1 rounded-lg border border-black hover:shadow-xl dark:border-[#333]"
				>
					<a href="#" class="hover_link_fill">Visit</a>
					<Fa icon={faAngleRight} />
				</div>
			</div>
		</div>
	</div>
</div>
