<script>
	import { onDestroy } from 'svelte';
	import DitherField from '$components/general/ditherField.svelte';
	import { NO_UI, peeks } from '$lib/data/peeks.js';

	/**
	 * Wraps a list of projects. Hovering (or tabbing to) a row marked
	 * `data-peek="<project name>"` floats a small print beside it: a screenshot on a
	 * dithered mat, or a receipt for the projects that have no interface to show
	 * (see $lib/data/peeks.js). Rows sharing a `data-peek-group` ancestor are
	 * scrubbed as one strip: the print stays up across the gaps and cuts straight
	 * from one project to the next. Mouse and keyboard only; touch gets the plain list.
	 *
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} children
	 * @property {{ name: string, description: string, imagelist?: string[] }[]} projects
	 */

	/** @type {Props} */
	let { children, projects } = $props();

	const REST = 1.5;

	let list = $state(null);
	let card = $state(null);
	let name = $state(null);
	let shown = $state(false);
	// Nothing is fetched until a mouse actually comes near the list.
	let armed = $state(false);

	// From then on every screenshot stays mounted (and decoded), so scrubbing never waits on one.
	const pictures = $derived(
		projects
			.filter((item) => peeks[item.name] && peeks[item.name] !== NO_UI)
			.map((item) => ({ name: item.name, src: peeks[item.name].image ?? item.imagelist?.[0] }))
			.filter((picture) => picture.src)
	);
	const peek = $derived(name && peeks[name] !== NO_UI ? peeks[name] : null);
	const project = $derived(projects.find((item) => item.name === name));

	const pointer = { x: 0, y: 0 };
	let x = 0;
	let y = 0;
	let lean = 0;
	let frame = 0;
	let snap = true;

	function follow() {
		frame = 0;
		if (!card || !list) return;

		const bounds = list.getBoundingClientRect();
		const width = card.offsetWidth;
		const height = card.offsetHeight;
		let left = bounds.right + 36;
		let top;

		if (left + width <= window.innerWidth - 20) {
			// Room in the margin: dock beside the list and ride up and down with the cursor.
			// The light-switch cord hangs in the top right corner on wider screens; stay under it.
			const underCord = window.innerWidth >= 768 && left + width > window.innerWidth - 64;
			const ceiling = underCord ? 148 : 12;
			top = Math.min(
				Math.max(pointer.y - height * 0.45, ceiling),
				Math.max(window.innerHeight - height - 12, ceiling)
			);
		} else {
			// No margin to speak of: hang just under the cursor, like a tooltip, so the
			// row being read stays readable. Flip above it near the bottom of the window.
			left = Math.min(Math.max(pointer.x + 16, 12), window.innerWidth - width - 12);
			top = pointer.y + 26;
			if (top + height > window.innerHeight - 12) top = pointer.y - 26 - height;
		}

		if (snap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			x = left;
			y = top;
			lean = 0;
			snap = false;
		} else {
			// Trail the cursor a little, and swing with the lag like something on a string.
			lean += (Math.max(-7, Math.min(7, (top - y) * 0.1)) - lean) * 0.18;
			x += (left - x) * 0.2;
			y += (top - y) * 0.2;
		}

		card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(REST + lean).toFixed(2)}deg)`;
		if (shown) frame = requestAnimationFrame(follow);
	}

	function show(next, clientX, clientY) {
		pointer.x = clientX;
		pointer.y = clientY;
		name = next;
		if (!shown) {
			snap = true;
			shown = true;
		}
		if (!frame) frame = requestAnimationFrame(follow);
	}

	function hide() {
		shown = false;
	}

	/** In the gap between two rows of the same group, the last print stays up. */
	function betweenRows(event) {
		const rows = event.target.closest?.('[data-peek-group]')?.querySelectorAll('[data-peek]');
		if (!rows?.length) return false;
		return (
			event.clientY >= rows[0].getBoundingClientRect().top &&
			event.clientY <= rows[rows.length - 1].getBoundingClientRect().bottom
		);
	}

	function onPointerMove(event) {
		if (event.pointerType !== 'mouse') return;
		armed = true;
		const row = event.target.closest?.('[data-peek]');
		if (row && peeks[row.dataset.peek]) {
			show(row.dataset.peek, event.clientX, event.clientY);
		} else if (!row && shown && betweenRows(event)) {
			pointer.x = event.clientX;
			pointer.y = event.clientY;
		} else {
			hide();
		}
	}

	function onFocusIn(event) {
		const row = event.target.closest?.('[data-peek]');
		if (!row || !peeks[row.dataset.peek] || !event.target.matches(':focus-visible')) return;
		armed = true;
		const rect = event.target.getBoundingClientRect();
		show(row.dataset.peek, rect.right, rect.top + rect.height / 2);
	}

	onDestroy(() => {
		if (frame) cancelAnimationFrame(frame);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={list}
	onpointermove={onPointerMove}
	onpointerleave={hide}
	onfocusin={onFocusIn}
	onfocusout={hide}
>
	{@render children()}
</div>

<div bind:this={card} class="peek" class:shown aria-hidden="true">
	<div class="print" class:off={!peek}>
		{#if shown && peek}
			<div class="mat" style="background: {peek.ramp[1]}">
				<DitherField
					pattern={peek.pattern}
					ramp={peek.ramp}
					matrix={peek.matrix}
					cell={5}
					seed={5}
				/>
			</div>
		{/if}
		<div class="frame">
			{#if armed}
				{#each pictures as picture (picture.name)}
					<img src={picture.src} alt="" width="800" height="500" class:on={picture.name === name} />
				{/each}
			{/if}
		</div>
	</div>

	{#if name && peeks[name] === NO_UI && project}
		<div class="slip">
			<div class="paper">
				<svg viewBox="0 0 24 24">
					<path d="M15.5 3.2a9 9 0 1 0 5.3 14.3A7.2 7.2 0 0 1 15.5 3.2Z" />
				</svg>
				<p class="title">no ui whatsoever</p>
				<hr />
				<p class="item">{project.name}</p>
				<p class="about">{project.description}</p>
				<hr />
				<p class="total"><span>pixels</span><span>0</span></p>
			</div>
		</div>
	{/if}
</div>

<style>
	/* It eases in, but leaves (and changes subject) at once: scrubbing the list stays crisp. */
	.peek {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 40;
		visibility: hidden;
		opacity: 0;
		pointer-events: none;
		will-change: transform;
	}

	.peek.shown {
		visibility: visible;
		opacity: 1;
		transition: opacity 160ms ease;
	}

	.print,
	.slip {
		transform: scale(0.94);
		transform-origin: 0 50%;
	}

	.shown .print,
	.shown .slip {
		transform: scale(1);
		transition: transform 260ms cubic-bezier(0.2, 0.9, 0.25, 1.3);
	}

	.print {
		position: relative;
		width: 20rem;
		padding: 0.7rem;
		overflow: hidden;
		border-radius: 0.9rem;
		box-shadow:
			0 1px 2px rgb(28 25 23 / 0.14),
			0 20px 34px -18px rgb(28 25 23 / 0.55);
	}

	.print.off {
		display: none;
	}

	.mat {
		position: absolute;
		inset: 0;
	}

	.frame {
		position: relative;
		aspect-ratio: 8 / 5;
		overflow: hidden;
		border-radius: 0.4rem;
		background: #faf7f2;
		box-shadow:
			0 0 0 1px rgb(28 25 23 / 0.16),
			0 8px 16px -8px rgb(28 25 23 / 0.5);
	}

	.frame img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
		visibility: hidden;
	}

	.frame img.on {
		visibility: visible;
	}

	/* The receipt, for the things that only exist in a terminal. */
	.slip {
		width: 13.5rem;
		filter: drop-shadow(0 1px 1px rgb(28 25 23 / 0.14)) drop-shadow(0 14px 16px rgb(28 25 23 / 0.2));
	}

	.paper {
		--tooth: 0.5rem;
		padding: 1.35rem 1rem 1.3rem;
		background: #fffdf8;
		color: #292524;
		font-family: 'Commit Mono', ui-monospace, monospace;
		font-size: 0.66rem;
		line-height: 1.5;
		/* Saw-toothed edges, torn off the roll top and bottom. */
		mask:
			conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom /
				var(--tooth) 51% repeat-x,
			conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top / var(--tooth) 51%
				repeat-x;
	}

	:global(.dark) .paper {
		background: #ece6da;
	}

	.paper p {
		margin: 0;
	}

	.paper svg {
		display: block;
		width: 1.2rem;
		margin: 0 auto 0.25rem;
		fill: currentColor;
	}

	.title {
		font-weight: 700;
		letter-spacing: 0.1em;
		text-align: center;
		text-transform: uppercase;
	}

	.paper hr {
		margin: 0.55rem 0;
		border: 0;
		border-top: 1px dashed #a8a29e;
	}

	.item {
		font-weight: 700;
	}

	.about {
		display: -webkit-box;
		overflow: hidden;
		color: #78716c;
		font-size: 0.6rem;
		line-height: 1.45;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
	}

	.total {
		display: flex;
		justify-content: space-between;
		font-weight: 700;
		text-transform: uppercase;
	}

	@media (prefers-reduced-motion: reduce) {
		.peek.shown,
		.shown .print,
		.shown .slip {
			transition: none;
		}
	}
</style>
