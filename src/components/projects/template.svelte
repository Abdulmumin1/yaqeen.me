<script>
	import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let details;
	//{'name':"Project Name", 'stack':['Stack1', 'Stack2', 'Stack3'], 'description':"a short sentence that gives a overall picture of the project"}
	import edit from '$lib/images/edit.png';
</script>

<div class="border border-black rounded-md p-6 flex flex-col w-full max-h-screen">
	<div>
		<h2 class="text-4xl lg:text-6xl">{details.name}</h2>
	</div>
	<div class="space-x-3 grid lg:grid-cols-2 grid-cols-1 items-center">
		<!-- <div>
			<img src={edit} alt="" class="h-full rounded-md" />
		</div> -->
		<div class="space-y-3">
			<p class="text-gray-500">{details.description}</p>
			<ul class="flex space-x-2 text-black">
				{#each details.stack as stack}
					<li class="border border-black bg-orange-100 p-1 rounded-md">{stack}</li>
				{/each}
			</ul>

			<a href="#" class="flex w-fit p-1 rounded items-center border border-black hover:shadow-xl"
				>Visit <div class="px-1" />
				<Fa icon={faAngleRight} /></a
			>
		</div>
	</div>
</div>
