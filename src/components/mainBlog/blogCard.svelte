<script>
	import { formatDate } from '$lib/js/utils.js';

	/**
	 * @typedef {Object} Props
	 * @property {any} details
	 * @property {any} latest
	 */

	/** @type {Props} */
	let { details, latest } = $props();
</script>

{#if latest}
	<div class="flex flex-col gap-2 py-4">
		<a
			href={`/blog/${details.slug}`}
			title={details.title}
			class="text-sm font-bold text-primary hover:opacity-60 transition-opacity"
		>
			{details.title}
		</a>
		<p class="text-xs opacity-60">{formatDate(details.date)}</p>
	</div>
{:else}
	<div class="flex flex-col gap-1 py-3">
		<a
			href={`/blog/${details.slug}`}
			title={details.title}
			class="text-xs font-medium hover:text-primary hover:text-primary transition-colors"
		>
			{details.title}
		</a>
		<p class="text-[10px] opacity-50">{formatDate(details.date)}</p>
	</div>
{/if}
