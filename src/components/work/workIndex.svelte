<script>
	import { linksOf } from '$lib/data/work.js';

	/**
	 * What has nothing to show but words gets a line, not an empty card: one
	 * block of the cards' ground, a line a thing.
	 *
	 * @typedef {Object} Props
	 * @property {any[]} entries - Entries from $lib/data/work.js.
	 */

	/** @type {Props} */
	let { entries } = $props();
</script>

<ul class="index">
	{#each entries as entry (entry.slug)}
		<li class="row">
			<span class="title">{entry.title}</span>
			{#if entry.summary}<span class="summary">{entry.summary}</span>{/if}
			<span class="meta">
				{entry.kind}{#if entry.year}<span class="dot">·</span>{entry.year}{/if}
			</span>
			<span class="links">
				{#each linksOf(entry) as link (link.name)}
					<a href={link.href} class="tiny-link" target={link.target} rel={link.rel}
						>{link.name} {link.arrow}</a
					>
				{/each}
			</span>
		</li>
	{/each}
</ul>

<style>
	.index {
		container-type: inline-size;
		margin: 0;
		padding: 0.25rem 1.125rem;
		list-style: none;
		border-radius: 1rem;
		background: var(--color-surface-muted);
	}

	.row {
		display: grid;
		grid-template-areas: 'title meta' 'summary summary' 'links links';
		grid-template-columns: 1fr auto;
		align-items: baseline;
		gap: 0.25rem 1.5rem;
		padding: 0.875rem 0;
	}

	.row + .row {
		border-top: 1px solid color-mix(in srgb, var(--color-text-main) 8%, transparent);
	}

	.title {
		grid-area: title;
		color: var(--color-text-main);
		font-family: var(--site-font-display);
		font-size: 1.0625rem;
		line-height: 1.3;
	}

	.summary {
		grid-area: summary;
		color: var(--color-text-muted);
		font-size: 0.9375rem;
		line-height: 1.5;
		text-wrap: pretty;
	}

	.meta {
		grid-area: meta;
		color: var(--color-text-faint);
		font-family: var(--site-font-utility);
		font-size: 0.75rem;
		letter-spacing: 0.04em;
		white-space: nowrap;
	}

	.dot {
		margin-inline: 0.4em;
	}

	.links {
		grid-area: links;
		display: flex;
		gap: 0.875rem;
	}

	/* Wide enough, and it reads across: name, line, when, where. */
	@container (width >= 48rem) {
		.row {
			grid-template-areas: 'title summary meta links';
			grid-template-columns: 12rem minmax(0, 1fr) 7rem 7rem;
		}

		.links {
			justify-content: flex-end;
		}
	}
</style>
