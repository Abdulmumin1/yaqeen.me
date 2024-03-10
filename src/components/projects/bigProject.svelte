<script>
	import Fa from 'svelte-fa';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { stackLinks } from '$lib/utils/stackLookup.js';
	import { faLayerGroup, faVideo } from '@fortawesome/free-solid-svg-icons';

	let modal;
	function openModal() {
		document.startViewTransition(() => {
			modal.showModal();
		});
	}

	function closeModal() {
		document.startViewTransition(() => {
			modal.close();
		});
	}

	export let title;
	export let description;
	export let link;
	export let stack;
</script>

<div
	class="bg-orange-100 flex flex-col gap-2 border border-b-2 dark:bg-stone-900 dark:border-dark border-orang rounded-3xl p-6 w-full"
>
	<div>
		<div class="flex justify-between items-center">
			<h4 class="title text-xl md:text-2xl font-bold font-visby_mid flex gap-2 items-center">
				{title}
				<!-- <button on:click={openModal}>
					<Fa icon={faVideo} />
				</button> -->
			</h4>
			<a href="https://github.com/{link}"><Fa icon={faGithub} /></a>
		</div>
		<a href={link} class="text-stone-800 dark:text-stone-500 text-sm">{link}</a>
	</div>

	<div>
		{description}
	</div>
	<!-- <p class="text-xl flex gap-2 items-center"><Fa icon={faLayerGroup} />Stack</p> -->
	<!-- <ul class="flex gap-2 flex-wrap text-black">
		{#each stack as st}
			<li class=" text-black bg-orang dark:bg-dark p-1 rounded-2xl">
				<a href={$stackLinks[st.toLowerCase()]} class="p-1">{st}</a>
			</li>
		{/each}
	</ul> -->
</div>
<dialog id="vidModal" bind:this={modal} class="bg-orange-200">
	<div class="flex flex-col gap-2">
		<h1 class="title text-xl font-visby_bold font-semibold flex justify-between">
			{title} <button on:click={closeModal}>Close</button>
		</h1>
		<!-- <video src="/css-faster.mp4" controls class="w-full h-full rounded-2xl">
			<track kind="captions" />
		</video> -->
	</div>
</dialog>

<style>
	#vidModal {
		max-width: 1000px;
		width: 90%;
		height: 90%;
		max-height: 1000px;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		transform: translateY(-100%);
		transition: transform 0.3s ease-in-out;
	}

	#vidModal[open] {
		transform: translateY(0);
	}

	#vidModal::backdrop {
		backdrop-filter: blur(1px);
	}

	/* Optional styles for backdrop */
	#vidModal::backdrop {
		background-color: rgba(49, 47, 44, 0.842);
	}

	/* #openModal {
		position: absolute;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@keyframes fadeOut {
		from {
			opacity: 1;
		}

		to {
			opacity: 0;
		}
	} */

	.title {
		view-transition-name: 'title';
	}
</style>
