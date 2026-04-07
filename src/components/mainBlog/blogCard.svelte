<script>
	import { resolve } from '$app/paths';
	import Fa from 'svelte-fa';
	import { faThumbTack } from '@fortawesome/free-solid-svg-icons';
	import { formatDate } from '$lib/js/utils.js';

	/**
	 * @typedef {Object} Props
	 * @property {any} details
	 * @property {any} latest
	 */

	/** @type {Props} */
	let { details, latest } = $props();

	let isExternal = $derived(Boolean(details?.isExternal));
	let isPinned = $derived(Boolean(details?.pinned));
</script>

{#if latest}
	<div class="flex flex-col gap-1 py-4 group w-full cursor-pointer">
		<div class="flex items-baseline gap-2 justify-between">
			{#if isExternal}
				<button
					type="button"
					title={details.title}
					onclick={() => window.open(details.href, '_blank', 'noopener,noreferrer')}
					class="text-left text-sm font-bold text-primary hover:opacity-60 transition-opacity font-semibold"
				>
					{details.title}
					<span class="ml-2 text-[9px] font-mono uppercase tracking-[0.2em] text-text-muted"
						>external</span
					>
				</button>
			{:else}
				<a
					href={resolve('/blog/[slug]', { slug: details.slug })}
					title={details.title}
					class="text-sm font-bold text-primary hover:opacity-60 transition-opacity"
				>
					{details.title}
				</a>
			{/if}
			<p class="text-[10px] font-mono text-text-muted whitespace-nowrap ml-4">
				{formatDate(details.date)}
			</p>
		</div>
	</div>
{:else}
	<div class="relative">
		{#if isPinned}
			<div class="shrink-0 absolute -top-1 left-0.5 text-text-muted/50" aria-hidden="true">
				<Fa icon={faThumbTack} class="size-1.5 rotate-25" />
			</div>
			<span class="sr-only">Pinned post</span>
		{/if}
		<div class="flex flex-col gap-1 py-3 group w-full">
			<div class="flex items-baseline gap-2 justify-between">
				{#if isExternal}
					<button
						type="button"
						title={details.title}
						onclick={() => window.open(details.href, '_blank', 'noopener,noreferrer')}
						class="text-left text-xs text-primary font-semibold hover:text-primary transition-colors"
					>
						{details.title}
						<span class="ml-2 text-[9px] font-mono uppercase tracking-[0.2em] text-text-muted/40"
							>ext</span
						>
					</button>
				{:else}
					<a
						href={resolve('/blog/[slug]', { slug: details.slug })}
						title={details.title}
						class="text-xs font-semibold text-primary hover:text-primary transition-colors"
					>
						{details.title}
					</a>
				{/if}
				<p class="text-[10px] font-mono text-text-muted whitespace-nowrap ml-4">
					{formatDate(details.date)}
				</p>
			</div>
		</div>
	</div>
{/if}
