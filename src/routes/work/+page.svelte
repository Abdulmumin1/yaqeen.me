<script>
	import { resolve } from '$app/paths';
	import Seo from '$components/general/seo.svelte';
	import WorkCard from '$components/work/workCard.svelte';
	import WorkGuide from '$components/work/workGuide.svelte';
	import WorkIndex from '$components/work/workIndex.svelte';
	import WorkTheater from '$components/work/workTheater.svelte';
	import { intro, openSource as openSourceWords } from '$components/work/workWords.svelte';
	import { chapters } from '$lib/data/work.js';

	let open = $state(null);

	const openSource = { id: 'open-source', number: '06', title: 'Open source' };
	const walk = [...chapters, openSource];

	const countOf = (chapter) =>
		chapter.rows?.reduce((total, row) => total + row.entries.length, 0) ?? 0;
</script>

<svelte:head>
	<Seo
		title="Work"
		description="Products, systems, design and experiments by Abdulmumin Yaqeen, in six short chapters."
	/>
</svelte:head>

<div class="work">
	<header class="page-column intro">
		<h1 class="sr-only">Work</h1>
		<p class="type-lead text-balance">{@render intro()}</p>

		<!-- The walk, set out before it starts. -->
		<ol class="contents" aria-label="Chapters">
			{#each walk as chapter (chapter.id)}
				<li>
					<a class="contents-row" href={`#${chapter.id}`}>
						<span class="number">{chapter.number}</span>
						<span class="name">{chapter.title}</span>
						{#if countOf(chapter)}<span class="count">{countOf(chapter)}</span>{/if}
					</a>
				</li>
			{/each}
		</ol>

		<p class="tour type-small">
			Or <a class="link" href={resolve('/work/tour')}>walk it on a board</a>, which is an experiment
			of its own.
		</p>
	</header>

	{#each chapters as chapter (chapter.id)}
		<section id={chapter.id} class="chapter" aria-labelledby={`${chapter.id}-title`}>
			<div class="page-column chapter-head">
				<p class="chapter-number">{chapter.number}</p>
				<h2 id={`${chapter.id}-title`} class="section-heading">{chapter.title}</h2>
				<p class="lede type-body text-pretty">{chapter.lede}</p>
			</div>

			{#each chapter.rows as row, index (index)}
				{#if row.layout === 'index'}
					<div class="spread"><WorkIndex entries={row.entries} /></div>
				{:else}
					<div class="spread cards cards-{row.layout}">
						{#each row.entries as entry (entry.slug)}
							<WorkCard {entry} onopen={(item) => (open = item)} />
						{/each}
					</div>
				{/if}
			{/each}
		</section>
	{/each}

	<section id="open-source" class="chapter" aria-labelledby="open-source-title">
		<div class="page-column chapter-head">
			<p class="chapter-number">{openSource.number}</p>
			<h2 id="open-source-title" class="section-heading">{openSource.title}</h2>
			<p class="lede type-body text-pretty">{@render openSourceWords()}</p>
		</div>
	</section>
</div>

<WorkGuide chapters={walk} />
<WorkTheater entry={open} onclose={() => (open = null)} />

<style>
	.work {
		padding-top: var(--page-top);
		padding-bottom: 6rem;
	}

	.intro {
		display: flex;
		flex-direction: column;
		gap: var(--gap-section);
	}

	.intro .type-lead {
		margin: 0;
		color: var(--color-text-main);
	}

	/* The contents: a number, a name, how many things are in it. */
	.contents {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--color-border);
	}

	.contents-row {
		display: grid;
		grid-template-columns: 2.5rem 1fr auto;
		align-items: baseline;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--color-border);
		color: var(--color-text-main);
		font-size: 1.0625rem;
		transition: color 160ms ease;
	}

	.contents-row:hover .name {
		text-decoration: underline;
		text-decoration-color: var(--color-accent);
		text-underline-offset: 0.2em;
	}

	.number,
	.count,
	.chapter-number {
		color: var(--color-text-faint);
		font-family: var(--site-font-utility);
		font-size: 0.8125rem;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.04em;
	}

	.tour {
		margin: calc(var(--gap-section) * -0.5) 0 0;
		color: var(--color-text-muted);
	}

	/* A chapter: its number, title and a line, in the column; then the work,
	   wider than the column, so it has room. */
	.chapter {
		padding-top: calc(var(--gap-section) * 2);
		scroll-margin-top: 1rem;
	}

	.chapter-head {
		margin-bottom: 2rem;
	}

	.chapter-number {
		margin: 0 0 0.5rem;
	}

	.chapter-head .section-heading {
		margin-bottom: 0.75rem;
	}

	.lede {
		max-width: 36rem;
		margin: 0;
		color: var(--color-text-body);
	}

	.spread {
		width: 100%;
		max-width: 78rem;
		margin-inline: auto;
		padding-inline: 1.5rem;
	}

	.cards {
		display: grid;
		gap: 1rem;
		align-items: stretch;
	}

	.spread + .spread {
		margin-top: 1rem;
	}

	.cards-small,
	.cards-posters {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	@media (width >= 40rem) {
		.cards-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.cards-small {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (width >= 52rem) {
		.cards-feature {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (width >= 64rem) {
		.cards-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.cards-small,
		.cards-posters {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (width < 30rem) {
		.cards-small {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
