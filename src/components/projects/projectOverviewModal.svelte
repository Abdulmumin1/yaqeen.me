<script>
	import { scale } from 'svelte/transition';
	import { getModalContext, getCurrentProjectInModal } from '$lib/utils/projectStore';
	import { onMount } from 'svelte';
	import { faArrowRightLong, faXmark } from '@fortawesome/free-solid-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import Fa from 'svelte-fa';

	let currentProject = getCurrentProjectInModal();
	let dummy = {
		name: 'Project Name',
		stack: ['Stack1', 'Stack2', 'Stack3'],
		description: 'A short sentence that gives an overall picture of the project',
		links: {
			study: 'https://github.com/yourusername/project',
			page: 'your-project-url.com'
		}
	};
	let details = $state(dummy);

	let toggler = getModalContext();
	let modal = $state();

	function openModal() {
		$toggler = true;
	}

	function closeModal() {
		$toggler = false;
	}

	onMount(() => {
		let unsubscribe = toggler.subscribe((data) => {
			if (data) {
				if (!$currentProject) return;
				details = $currentProject;
				if (details?.imagelist) {
					list = details.imagelist;
				}
				modal.showModal();
			} else {
				modal.close();
				$currentProject = null;
				list = dummyImages;
			}
		});

		return () => {
			unsubscribe();
		};
	});

	let dummyImages = ['/dummy.png', '/dummy.png', '/dummy.png', '/dummy.png'];
	let list = $state(dummyImages);
</script>

<dialog
	bind:this={modal}
	class="w-full max-w-[90%] font-visby p-6 rounded-2xl border border-orang dark:border-dark bg-orange-100 dark:bg-stone-900 text-stone-900 dark:text-orange-100"
>
	<div class="flex justify-between items-center mb-4">
		<h2 class="text-3xl lg:text-4xl font-visby_bold font-extrabold">{details.name}</h2>
		<button
			onclick={closeModal}
			class="text-stone-600 hover:text-stone-800 dark:text-orange-300 dark:hover:text-orange-100"
		>
			<Fa icon={faXmark} />
		</button>
	</div>

	<p class="text-stone-700 dark:text-orange-200 mb-4 max-w-[20rem]">{details.description}</p>

	<div class="flex space-x-4 mb-6">
		{#if details.links?.study}
			<a
				target="_blank"
				href={details.links.study}
				class="flex items-center space-x-2 bg-orange-300 dark:bg-orange-700 hover:bg-orange-400 dark:hover:bg-orange-600 text-stone-900 dark:text-orange-100 font-bold py-2 px-4 rounded-lg"
			>
				<Fa icon={faGithub} />
				<span>View on GitHub</span>
			</a>
		{/if}
		<a
			target={details?.onpage ? '_self' : '_blank'}
			href="{details?.onpage ? '' : 'https://'}{details.links.page}"
			class="flex items-center space-x-2 bg-orange-300 dark:bg-orange-700 hover:bg-orange-400 dark:hover:bg-orange-600 text-stone-900 dark:text-orange-100 font-bold py-2 px-4 rounded-lg"
		>
			<span>Visit Website</span>
			<Fa icon={faArrowRightLong} />
		</a>
	</div>

	<div class="flex gap-4 overflow-x-auto mb-6">
		{#each list as img, index}
			<img
				alt={`Project image ${index + 1}`}
				src={img}
				class="w-[720px] border-4 border-orange-200 dark:border-dark object-contain rounded-xl"
			/>
		{/each}
	</div>

	<div class="mb-4">
		<h3 class="text-xl font-semibold mb-2">Tech Stack</h3>
		<ul class="flex gap-2 flex-wrap">
			{#each details.stack as stack}
				<li
					class="bg-orange-200 dark:bg-stone-700 text-stone-800 dark:text-orange-100 px-2 py-1 rounded-md text-sm"
				>
					{stack}
				</li>
			{/each}
		</ul>
	</div>
</dialog>

<style>
	/* dialog::backdrop {
		backdrop-filter: blur(0.2px);
	} */
</style>
