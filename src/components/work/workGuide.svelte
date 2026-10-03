<script>
	import { onMount } from 'svelte';

	/**
	 * The walk's guide: a small pill at the foot of the window saying which
	 * chapter you are in and what comes next. A dot per chapter jumps to it.
	 * It shows once the first chapter is under way.
	 *
	 * @typedef {Object} Props
	 * @property {{ id: string, number: string, title: string }[]} chapters
	 */

	/** @type {Props} */
	let { chapters } = $props();

	let current = $state(-1);

	const here = $derived(chapters[current]);
	const next = $derived(chapters[current + 1]);

	function go(id) {
		const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (id) {
			document.getElementById(id)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
		} else {
			window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
		}
	}

	onMount(() => {
		const sections = chapters.map(({ id }) => document.getElementById(id)).filter(Boolean);

		// The chapter you are in is the one across the middle of the window.
		function update() {
			const line = window.innerHeight * 0.55;
			let index = -1;
			sections.forEach((section, i) => {
				if (section.getBoundingClientRect().top <= line) index = i;
			});
			// Past the end of the last one, the walk is over.
			const last = sections.at(-1);
			if (last && last.getBoundingClientRect().bottom < window.innerHeight * 0.35) index = -1;
			current = index;
		}

		let frame = 0;
		const onscroll = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(update);
		};
		update();
		window.addEventListener('scroll', onscroll, { passive: true });
		window.addEventListener('resize', onscroll);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onscroll);
			window.removeEventListener('resize', onscroll);
		};
	});
</script>

<nav class="guide" class:shown={here} aria-label="Chapters" inert={!here}>
	<span class="here" aria-live="polite">
		{#if here}<span class="number">{here.number}</span> {here.title}{/if}
	</span>

	<span class="dots">
		{#each chapters as chapter, index (chapter.id)}
			<button
				type="button"
				class="dot"
				class:on={index === current}
				class:done={index < current}
				aria-label={`${chapter.number} ${chapter.title}`}
				aria-current={index === current ? 'step' : undefined}
				onclick={() => go(chapter.id)}
			></button>
		{/each}
	</span>

	<button type="button" class="next" onclick={() => go(next?.id)}>
		{#if next}<span class="label">next</span> {next.title} ↓{:else}back to the top ↑{/if}
	</button>
</nav>

<style>
	.guide {
		position: fixed;
		left: 50%;
		bottom: 1.25rem;
		z-index: 40;
		display: flex;
		align-items: center;
		gap: 0.875rem;
		padding: 0.375rem 0.375rem 0.375rem 1rem;
		border: 1px solid color-mix(in srgb, var(--color-text-main) 9%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-surface) 94%, transparent);
		box-shadow: 0 10px 30px -14px rgb(0 0 0 / 0.25);
		color: var(--color-text-main);
		font-family: var(--site-font-utility);
		font-size: 0.8125rem;
		white-space: nowrap;
		backdrop-filter: blur(16px) saturate(1.2);
		-webkit-backdrop-filter: blur(16px) saturate(1.2);
		opacity: 0;
		transform: translate(-50%, 0.75rem);
		pointer-events: none;
		transition:
			opacity 260ms ease,
			transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.guide.shown {
		opacity: 1;
		transform: translate(-50%, 0);
		pointer-events: auto;
	}

	.number {
		color: var(--color-text-faint);
		font-variant-numeric: tabular-nums;
	}

	.dots {
		display: flex;
		align-items: center;
		gap: 0.125rem;
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

	.next {
		padding: 0.375rem 0.75rem;
		border-radius: 999px;
		background: var(--color-surface-muted);
		color: var(--color-text-main);
		cursor: pointer;
		transition: background-color 160ms ease;
	}

	.next:hover {
		background: color-mix(in srgb, var(--color-text-main) 10%, var(--color-surface-muted));
	}

	.label {
		color: var(--color-text-faint);
	}

	@media (width < 40rem) {
		.dots {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.guide,
		.dot::before {
			transition: none;
		}
	}
</style>
