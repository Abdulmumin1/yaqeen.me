<script>
	import { onMount } from 'svelte';
	import { createHabitat, frameSky, loadAtlas, perchesIn, spotOn } from '$lib/butterfly/habitat.js';

	/**
	 * A few monarchs living over whatever this is put in (its nearest positioned
	 * ancestor): a footer with a flower bed in it, a wall of names. They sit on
	 * the `perches` in there, wander from one to another, scatter when the
	 * cursor comes for them and settle again.
	 *
	 * The same butterfly as $components/home/butterfly.svelte, in company and
	 * without the tricks. How they behave is in $lib/butterfly/habitat.js.
	 *
	 * @typedef {Object} Props
	 * @property {string} [perches] - Selector for the things they sit on (see habitat.js).
	 * @property {number} [count] - How many, at most. A narrow screen gets two.
	 * @property {'page' | 'ground'} [roams] - Kept over the ancestor, or free to cross the whole page.
	 */

	/** @type {Props} */
	let { perches = '[data-perch]', count = 3, roams = 'ground' } = $props();

	const SPANS = [34, 28, 38, 31, 36]; // px across, one each: no two butterflies the same size
	const STAGE = 124; // px square each is drawn in

	let garden = $state(null);
	let stages = $state([]);
	let shown = $state(false);
	let stills = $state([]); // where the still pictures go, when there is to be no flying

	onMount(() => {
		const ground = garden.offsetParent;
		if (!ground) return;
		let stopped = false;
		let undo = () => {};
		const unframe = frameSky(garden, ground);

		const narrow = window.matchMedia('(max-width: 640px)').matches;
		const flock = stages
			.slice(0, narrow ? Math.min(count, 2) : count)
			.map((canvas, n) => ({ canvas, span: SPANS[n % SPANS.length] }));

		/** Still pictures, one to a perch. */
		function settleForPlain() {
			const sit = () => {
				stills = perchesIn(ground, perches)
					.slice(0, flock.length)
					.map((perch, n) => ({
						...spotOn(perch, ground, 0, flock[n].span * 0.61),
						span: flock[n].span
					}));
				shown = true;
			};
			const watcher = new ResizeObserver(sit);
			watcher.observe(ground);
			undo = () => watcher.disconnect();
			document.fonts.ready.then(() => requestAnimationFrame(sit));
		}

		function comeAlive(atlas) {
			const habitat = createHabitat({
				ground,
				atlas,
				perches,
				stage: STAGE,
				butterflies: flock,
				restless: [7, 22],
				pace: 0.82,
				greets: true,
				roams,
				onShow: () => (shown = true)
			});
			if (!habitat) return settleForPlain();
			undo = () => habitat.destroy();
		}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			settleForPlain();
		} else {
			Promise.all([loadAtlas(), document.fonts.ready]).then(
				([atlas]) => !stopped && comeAlive(atlas),
				() => !stopped && settleForPlain()
			);
		}

		return () => {
			stopped = true;
			undo();
			unframe();
		};
	});
</script>

<!-- The sky is laid over the whole page and clips at its edges (see frameSky in habitat.js). -->
<div bind:this={garden} class="garden" class:shown aria-hidden="true">
	<div class="origin">
		{#each { length: count }, n (n)}
			<canvas bind:this={stages[n]}></canvas>
		{/each}
		{#each stills as still, n (n)}
			<img
				src="/butterfly/monarch-small.webp"
				alt=""
				width="128"
				height="80"
				draggable="false"
				style:width="{still.span * 0.8}px"
				style:transform="translate3d({still.x}px, {still.y}px, 0) translate(-50%, -50%) rotate({n %
				2
					? 14
					: -18}deg)"
			/>
		{/each}
	</div>
</div>

<style>
	.garden {
		position: absolute;
		top: calc(-1 * var(--sky-up, 0px));
		right: calc(-1 * var(--sky-right, 0px));
		bottom: calc(-1 * var(--sky-below, 0px));
		left: calc(-1 * var(--sky-left, 0px));
		z-index: 3;
		overflow: hidden;
		overflow: clip;
		pointer-events: none;
	}

	/* The ground's own top left corner: what the butterflies' coordinates are measured from. */
	.origin {
		position: absolute;
		top: var(--sky-up, 0px);
		left: var(--sky-left, 0px);
		opacity: 0;
		transition: opacity 500ms ease;
	}

	.shown .origin {
		opacity: 1;
	}

	canvas,
	img {
		position: absolute;
		top: 0;
		left: 0;
	}

	canvas {
		width: 124px;
		height: 124px;
		will-change: transform;
	}

	img {
		max-width: none;
		height: auto;
		filter: drop-shadow(0 2px 2px rgb(28 25 23 / 0.2));
	}

	@media print {
		.garden {
			display: none;
		}
	}
</style>
