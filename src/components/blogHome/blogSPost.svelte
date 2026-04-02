<script>
	import { resolve } from '$app/paths';
	import Fa from 'svelte-fa';
	import { faThumbTack } from '@fortawesome/free-solid-svg-icons';
	import { formatDate } from '$lib/js/utils.js';

	let { title, link, date, visual, external = false, slug, pinned = false } = $props();
</script>

<div class="flex flex-col gap-1 py-3 group w-full relative">
	{#if pinned}
		<div class="shrink-0 absolute -top-1 left-0.5 text-stone-500/50" aria-hidden="true">
			<Fa icon={faThumbTack} class="size-1.5 rotate-25" />
		</div>
		<span class="sr-only">Pinned post</span>
	{/if}
	<div class="flex items-baseline gap-2 justify-between">
		{#if external}
			<button
				type="button"
				onclick={() => window.open(link, '_blank', 'noopener,noreferrer')}
				class="text-left text-sm font-bold text-primary hover:underline underline-offset-2 transition-all"
			>
				{title}
				<span class="ml-2 text-[9px] font-mono uppercase tracking-[0.2em] opacity-40">ext</span>
			</button>
		{:else}
			<a
				href={resolve('/blog/[slug]', { slug })}
				class="text-sm font-bold text-primary hover:underline underline-offset-2 transition-all"
			>
				{title}
			</a>
		{/if}
		<p class="text-[9px] font-mono opacity-30 whitespace-nowrap ml-4">
			{formatDate(date)}
		</p>
	</div>
</div>
