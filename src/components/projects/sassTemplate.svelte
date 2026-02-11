<script>
	import { scale } from 'svelte/transition';
	import { getModalContext, getCurrentProjectInModal } from '$lib/utils/projectStore';
	import { darkMode } from '$lib/utils/darkmode.js';

	import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	let { details } = $props();

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

<div class="flex flex-col gap-1 py-3 group w-full">
	<div class="flex items-baseline gap-2">
		<h3 class="text-sm font-bold text-orang dark:text-dark">
			{details.name}
		</h3>
		<a
			href="https://{details.links.page}"
			target="_blank"
			class="text-[9px] font-mono opacity-30 hover:opacity-100 transition-opacity"
		>
			{details.links.page}
		</a>
	</div>
	<p class="text-xs opacity-60 leading-relaxed max-w-sm">
		{details.description}
	</p>
</div>

<!-- 
<style>
    #f97316
    #ea580c
    #c2410c
</style> -->
