<script>
	import { resolve } from '$app/paths';
	import Seo from '$components/general/seo.svelte';
	import WorkCanvas from '$components/work/workCanvas.svelte';
	import WorkCard from '$components/work/workCard.svelte';
	import WorkIndex from '$components/work/workIndex.svelte';
	import WorkTheater from '$components/work/workTheater.svelte';
	import { intro, openSource } from '$components/work/workWords.svelte';
	import { chapters } from '$lib/data/work.js';

	/* The same chapters as /work, laid out on a board as a path that winds
	   back and forth, three stops to a row, and walked one stop at a time. */

	const COLUMNS = 3;

	let canvas = $state(null);
	let stop = $state(0);
	let count = $state(0);
	let wandering = $state(false);
	let zoom = $state(1);
	let open = $state(null);
	let captionHeight = $state(0);

	function chunk(list, size) {
		const parts = [];
		for (let i = 0; i < list.length; i += size) parts.push(list.slice(i, i + size));
		return parts;
	}

	// A chapter is a stop, or, if it is long, a few: a row of at most four
	// things each, so a stop fits a window at a size you can read. The list,
	// if there is one, goes with the last of them.
	function stopsOf(id, { size = 4, together = false } = {}) {
		const chapter = chapters.find((item) => item.id === id);
		const list = chapter.rows.find((row) => row.layout === 'index');
		const groups = together
			? [chapter.rows]
			: chapter.rows
					.filter((row) => row !== list)
					.flatMap((row) =>
						chunk(row.entries, size).map((entries) => [{ layout: row.layout, entries }])
					);
		if (list && !together) groups.at(-1).push(list);
		return groups.map((rows, part) => ({
			key: groups.length > 1 ? `${id}-${part + 1}` : id,
			number: chapter.number,
			title: chapter.title,
			lede: chapter.lede,
			part,
			parts: groups.length,
			rows
		}));
	}

	// How wide a card is on the board, which is laid out once, at life size.
	function widthOf(row) {
		if (row.layout === 'feature') return row.entries.length > 2 ? '21rem' : '30.5rem';
		return { grid: '21rem', posters: '14.75rem', small: '18rem' }[row.layout] ?? '21rem';
	}

	const stops = [
		{
			key: 'start',
			number: '00',
			title: 'Work',
			lede: 'Six chapters, a stop at a time. Press space or next to walk on, or drag, scroll and pinch to look around on your own.',
			words: intro
		},
		...stopsOf('products'),
		...stopsOf('systems'),
		...stopsOf('design'),
		...stopsOf('experiments', { together: true }),
		...stopsOf('everything-else'),
		{
			key: 'open-source',
			number: '06',
			title: 'Open source',
			lede: 'The last stop: the work that is in other people’s projects.',
			words: openSource
		}
	].map((item, index) => {
		// Left to right, then right to left on the row below, and so on.
		const row = Math.floor(index / COLUMNS);
		const step = index % COLUMNS;
		return { parts: 1, ...item, row: row + 1, column: (row % 2 ? COLUMNS - 1 - step : step) + 1 };
	});

	const here = $derived(stops[stop]);
	const ahead = $derived(stops[stop + 1]);

	/* The way between the stops, a line from each to the next, so the order
	   of the walk reads off the board. Stops on a row share a middle, and so
	   do stops in a column, so every leg is straight across or straight down. */
	let legs = $state([]);

	function trace(node) {
		const measure = () => {
			const boxes = [...node.querySelectorAll(':scope > [data-stop]')].map((element) => ({
				left: element.offsetLeft,
				top: element.offsetTop,
				right: element.offsetLeft + element.offsetWidth,
				bottom: element.offsetTop + element.offsetHeight
			}));
			legs = boxes.slice(1).map((to, index) => {
				const from = boxes[index];
				if (stops[index].row === stops[index + 1].row) {
					const [a, b] = from.left < to.left ? [from, to] : [to, from];
					const space = Math.min(40, (b.left - a.right) / 4);
					const y = (from.top + from.bottom) / 2;
					return { x1: a.right + space, y1: y, x2: b.left - space, y2: y };
				}
				const space = Math.min(40, (to.top - from.bottom) / 4);
				const x = (from.left + from.right) / 2;
				return { x1: x, y1: from.bottom + space, x2: x, y2: to.top - space };
			});
		};
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		for (const element of node.querySelectorAll(':scope > [data-stop]')) observer.observe(element);
		return () => observer.disconnect();
	}

	const nameOf = (item) =>
		item.parts > 1 ? `${item.title}, ${item.part + 1} of ${item.parts}` : item.title;

	function onward() {
		if (wandering) canvas?.resume();
		else if (ahead) canvas?.next();
		else canvas?.goTo(0);
	}
</script>

<svelte:head>
	<Seo
		title="Work, on a board"
		description="Products, systems, design and experiments by Abdulmumin Yaqeen, walked through on a board, a stop at a time."
	/>
</svelte:head>

<h1 class="sr-only">Work, on a board</h1>

<WorkCanvas
	bind:this={canvas}
	bind:stop
	bind:count
	bind:wandering
	bind:zoom
	inset={captionHeight + 24}
	label="Work, as a board"
>
	<div class="board" {@attach trace}>
		<svg class="path" aria-hidden="true">
			{#each legs as leg, index (index)}
				<line {...leg} class:walked={index < stop} vector-effect="non-scaling-stroke" />
			{/each}
		</svg>
		{#each stops as item (item.key)}
			<section
				class="stop"
				class:words={item.words}
				data-stop
				style:grid-row={item.row}
				style:grid-column={item.column}
				aria-labelledby={`${item.key}-title`}
			>
				<header class="stop-head">
					<span class="stop-number">{item.number}</span>
					<h2 id={`${item.key}-title`} class="section-heading">{item.title}</h2>
					{#if item.parts > 1}<span class="stop-part">{item.part + 1} of {item.parts}</span>{/if}
				</header>

				{#if item.words}
					<p class={item.key === 'start' ? 'type-lead text-balance' : 'type-body text-pretty'}>
						{@render item.words()}
					</p>
					{#if item.key === 'start'}
						<p class="aside type-small">
							Or <a class="link" href={resolve('/work')}>read it as chapters</a>, one after the
							other.
						</p>
					{/if}
				{:else}
					{#each item.rows as row, index (index)}
						{#if row.layout === 'index'}
							<WorkIndex entries={row.entries} />
						{:else}
							<div class="cards" style:--card={widthOf(row)}>
								{#each row.entries as entry (entry.slug)}
									<WorkCard {entry} onopen={(choice) => (open = choice)} />
								{/each}
							</div>
						{/if}
					{/each}
				{/if}
			</section>
		{/each}
	</div>
</WorkCanvas>

<!-- The guide: where you are, a line on it, and the way on. -->
<div class="caption" bind:clientHeight={captionHeight} role="group" aria-label="The walk">
	<div class="caption-head">
		<p class="where" aria-live="polite">
			<span class="number">{here.number}</span>
			<span class="title">{here.title}</span>
			{#if here.parts > 1}<span class="part">{here.part + 1} of {here.parts}</span>{/if}
		</p>
		<span class="steps">
			<button
				type="button"
				class="step back"
				onclick={() => canvas?.previous()}
				disabled={stop === 0}
				aria-label="Back a stop">←</button
			>
			<button type="button" class="step on" onclick={onward}>
				{#if wandering}
					back to the walk
				{:else if ahead}
					<span class="label">next</span>
					{nameOf(ahead)}
				{:else}
					from the start
				{/if}
				<span aria-hidden="true">→</span>
			</button>
		</span>
	</div>

	<p class="lede">{here.lede}</p>

	<div class="caption-foot">
		<span class="dots">
			{#each stops as item, index (item.key)}
				<button
					type="button"
					class="dot"
					class:on={index === stop}
					class:done={index < stop}
					aria-label={`${item.number} ${nameOf(item)}`}
					aria-current={index === stop ? 'step' : undefined}
					onclick={() => canvas?.goTo(index)}
				></button>
			{/each}
		</span>
		<span class="view" role="toolbar" aria-label="Board view">
			<button type="button" onclick={() => canvas?.zoomOut()} aria-label="Zoom out">−</button>
			<span class="zoom" aria-label="Zoom">{Math.round(zoom * 100)}%</span>
			<button type="button" onclick={() => canvas?.zoomIn()} aria-label="Zoom in">+</button>
			<span class="divider" aria-hidden="true"></span>
			<button type="button" onclick={() => canvas?.overview()}>see all</button>
		</span>
	</div>
	<span class="sr-only">Stop {stop + 1} of {count}.</span>
</div>

<WorkTheater entry={open} onclose={() => (open = null)} />

<style>
	/* The board: the stops on a winding path, wide apart so each one is on
	   its own in the window. */
	.board {
		position: relative;
		display: grid;
		grid-auto-columns: auto;
		place-items: center;
		gap: 12rem 14rem;
		padding: 10rem 12rem;
	}

	/* A hairline at any zoom: the line is drawn in the window's pixels, not
	   the board's. The way walked so far is a shade darker. */
	.path {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
	}

	.path line {
		stroke: color-mix(in srgb, var(--color-text-main) 18%, transparent);
		stroke-width: 1.25;
		stroke-linecap: round;
		transition: stroke 500ms ease;
	}

	.path line.walked {
		stroke: color-mix(in srgb, var(--color-text-main) 42%, transparent);
	}

	.stop {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.stop.words {
		width: 36rem;
		gap: 1.5rem;
	}

	.stop-head {
		display: flex;
		align-items: baseline;
		gap: 0.875rem;
		margin-bottom: 0.5rem;
	}

	.stop-head .section-heading {
		margin: 0;
	}

	.stop-number,
	.stop-part {
		color: var(--color-text-faint);
		font-family: var(--site-font-utility);
		font-size: 0.8125rem;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.04em;
	}

	.stop-part {
		margin-left: auto;
	}

	.stop p {
		margin: 0;
		color: var(--color-text-main);
	}

	.stop .aside {
		color: var(--color-text-muted);
	}

	/* Cards at a fixed size, in one row: the board is laid out once, at life
	   size, and a wide row suits a wide window. */
	.cards {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: var(--card);
		gap: 1rem;
		align-items: stretch;
	}

	/* A narrow window gets a column instead, framed across and scrolled down. */
	@media (width < 48rem) {
		.board {
			gap: 8rem;
			padding: 4rem;
		}

		.stop.words {
			width: 20rem;
		}

		.cards {
			grid-auto-flow: row;
			grid-template-columns: 20rem;
		}
	}

	/* ---- The caption ---------------------------------------------------- */

	.caption {
		position: fixed;
		left: 50%;
		bottom: 1rem;
		z-index: 40;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		width: min(38rem, calc(100vw - 2rem));
		padding: 0.875rem 1rem 0.625rem 1.125rem;
		border: 1px solid color-mix(in srgb, var(--color-text-main) 9%, transparent);
		border-radius: 1.125rem;
		background: color-mix(in srgb, var(--color-surface) 94%, transparent);
		box-shadow: 0 16px 40px -20px rgb(0 0 0 / 0.3);
		color: var(--color-text-main);
		transform: translateX(-50%);
		backdrop-filter: blur(16px) saturate(1.2);
		-webkit-backdrop-filter: blur(16px) saturate(1.2);
	}

	.caption-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.where {
		display: flex;
		align-items: baseline;
		gap: 0.625rem;
		min-width: 0;
		margin: 0;
	}

	.where .title {
		font-family: var(--site-font-display);
		font-size: 1.0625rem;
	}

	.number,
	.part,
	.label {
		color: var(--color-text-faint);
		font-family: var(--site-font-utility);
		font-size: 0.75rem;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.04em;
	}

	.steps {
		display: flex;
		flex-shrink: 0;
		gap: 0.25rem;
	}

	.step {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		height: 2rem;
		padding: 0 0.875rem;
		border-radius: 999px;
		background: var(--color-surface-muted);
		color: var(--color-text-main);
		font-family: var(--site-font-utility);
		font-size: 0.8125rem;
		white-space: nowrap;
		cursor: pointer;
		transition:
			background-color 160ms ease,
			opacity 160ms ease;
	}

	.step:hover:not(:disabled) {
		background: color-mix(in srgb, var(--color-text-main) 10%, var(--color-surface-muted));
	}

	.step:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.step.back {
		width: 2rem;
		justify-content: center;
		padding: 0;
	}

	.lede {
		margin: 0;
		color: var(--color-text-body);
		font-size: 0.9375rem;
		line-height: 1.5;
		text-wrap: pretty;
	}

	.caption-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-top: 0.5rem;
		border-top: 1px solid color-mix(in srgb, var(--color-text-main) 7%, transparent);
	}

	.dots {
		display: flex;
		align-items: center;
	}

	/* A wide target around a small mark. */
	.dot {
		display: grid;
		place-items: center;
		width: 1rem;
		height: 1.5rem;
		cursor: pointer;
	}

	.dot::before {
		content: '';
		width: 0.375rem;
		height: 0.375rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-text-main) 18%, transparent);
		transition:
			background-color 200ms ease,
			width 260ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.dot.done::before {
		background: color-mix(in srgb, var(--color-text-main) 45%, transparent);
	}

	.dot.on::before {
		width: 0.875rem;
		background: var(--color-accent);
	}

	.dot:hover::before {
		background: var(--color-text-main);
	}

	.view {
		display: flex;
		align-items: center;
		gap: 0.125rem;
		color: var(--color-text-muted);
		font-family: var(--site-font-utility);
		font-size: 0.75rem;
	}

	.view button {
		min-width: 1.75rem;
		height: 1.75rem;
		padding: 0 0.5rem;
		border-radius: 999px;
		cursor: pointer;
		transition:
			background-color 160ms ease,
			color 160ms ease;
	}

	.view button:hover {
		background: color-mix(in srgb, var(--color-text-main) 7%, transparent);
		color: var(--color-text-main);
	}

	.zoom {
		min-width: 2.75rem;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}

	.divider {
		width: 1px;
		height: 1rem;
		margin: 0 0.25rem;
		background: color-mix(in srgb, var(--color-text-main) 12%, transparent);
	}

	@media (width < 36rem) {
		.step .label {
			display: none;
		}

		.view .zoom,
		.view button[aria-label] {
			display: none;
		}

		.divider {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.path line,
		.step,
		.dot::before,
		.view button {
			transition: none;
		}
	}
</style>
