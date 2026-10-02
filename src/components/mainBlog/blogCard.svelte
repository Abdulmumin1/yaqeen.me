<script>
	import { resolve } from '$app/paths';
	import Fa from 'svelte-fa';
	import { faThumbTack, faLongArrowRight } from '@fortawesome/free-solid-svg-icons';

	/**
	 * @typedef {Object} Props
	 * @property {any} details
	 */

	/** @type {Props} */
	let { details } = $props();

	let isExternal = $derived(Boolean(details?.isExternal));
	let isPinned = $derived(Boolean(details?.pinned));

	// The title, all but its last word, and then that word (see the markup).
	let words = $derived(
		String(details?.title ?? '')
			.trim()
			.split(/\s+/)
	);
	let head = $derived(words.length > 1 ? `${words.slice(0, -1).join(' ')} ` : '');
	let tail = $derived(words[words.length - 1]);

	function formatDisplayDate(dateStr) {
		const d = new Date(dateStr);
		const month = d.toLocaleString('default', { month: 'short' });
		const day = d.getDate();
		const currentYear = new Date().getFullYear();
		if (d.getFullYear() < currentYear) {
			const year = d.getFullYear().toString().slice(-2);
			return `${month} ${day} '${year}`;
		}
		return `${month} ${day}`;
	}
</script>

<!-- The title's words. Its marks follow, tied to the last word, so every title starts
     at the same edge and no arrow or pin is ever left on a line by itself. -->
{#snippet title()}
	{head}<span class="whitespace-nowrap"
		>{tail}{#if isExternal}<span
				class="ml-1.5 inline-block align-middle text-accent"
				aria-hidden="true"><Fa icon={faLongArrowRight} class="-rotate-45" /></span
			>{/if}{#if isPinned}<span
				class="ml-1.5 inline-block rotate-45 align-middle text-accent min-[60rem]:hidden"
				aria-label="Pinned post"><Fa icon={faThumbTack} class="size-2.5" /></span
			>{/if}</span
	>
{/snippet}

<!-- A post in a list. Where there is room, its date hangs in the margin beside it. -->
<div class="hang-row">
	<div class="hang-meta max-[60rem]:hidden">
		{#if isPinned}
			<Fa
				icon={faThumbTack}
				class="size-2.5 rotate-45 self-center text-accent"
				aria-hidden="true"
			/>
		{/if}
		<time datetime={details.date}>{formatDisplayDate(details.date)}</time>
	</div>

	<div class="type-list">
		{#if isExternal}
			<a href={details.href} target="_blank" rel="noopener noreferrer" class="row-link"
				>{@render title()}</a
			>
		{:else}
			<a href={resolve('/blog/[slug]', { slug: details.slug })} class="row-link"
				>{@render title()}</a
			>
		{/if}
	</div>
</div>
