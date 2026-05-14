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

	let modalContext = getModalContext();
	let currentProject = getCurrentProjectInModal();

	function openModal() {
		$currentProject = details;
		$modalContext = true;
	}

	onDestroy(() => {
		$modalContext = false;
	});
</script>

<div class="flex flex-col gap-1 py-3 group w-full">
	<div class="flex items-baseline gap-2 justify-between">
		<div class="flex items-baseline gap-2">
			<h3 class="text-sm font-bold text-primary">
				<a
					href={details.links?.page ? `https://${details.links?.page}` : details.links?.study}
					target="_blank">{details.name}</a
				>
			</h3>
			<!-- {#if details.year}<span class="text-[9px] font-mono text-text-muted">{details.year}</span>{/if} -->
		</div>
		<div class="flex gap-3 text-[9px] font-mono text-text-muted">
			{#if details.links.page}
				<a
					href="https://{details.links.page}"
					target="_blank"
					class="hover:text-text-main transition-colors uppercase"
				>
					visit
				</a>
			{/if}
			{#if details.links.study}
				<a
					href={details.links.study}
					target="_blank"
					class="hover:text-text-main transition-colors uppercase"
				>
					github
				</a>
			{/if}
		</div>
	</div>
	<p class="text-xs text-text-muted leading-relaxed max-w-xl">
		{details.description}
	</p>
</div>

<style>
	.animate-h {
		transition: height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
</style>
