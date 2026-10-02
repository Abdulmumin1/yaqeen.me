<script>
	import { onMount } from 'svelte';
	import {
		createHabitat,
		frameSky,
		loadAtlas,
		perchesIn,
		spotOn,
		viewOf,
		within
	} from '$lib/butterfly/habitat.js';

	/**
	 * A monarch that lives on the page.
	 *
	 * It flies in and settles on the first thing it can: a section heading, or
	 * anything marked data-perch. Come at it with the cursor and it gets
	 * nervous, then goes: the faster you close in, the sooner. Creep up and you
	 * can nearly touch it. It flutters off to sit somewhere else, wanders about
	 * of its own accord now and then, follows you down the page when you scroll
	 * away, starts when the lights go on or off, and if you leave the cursor
	 * lying still for long enough it may well come and sit on it.
	 *
	 * All of that is in $lib/butterfly (habitat.js for how it behaves, flight.js
	 * for how it flies, monarch.js for how it is drawn). This file gives it a
	 * page to live on: its nearest positioned ancestor.
	 *
	 * @typedef {Object} Props
	 * @property {string} [perches] - Selector for the things it may sit on (see habitat.js).
	 */

	/** @type {Props} */
	let { perches = 'h2, [data-perch]' } = $props();

	const SPAN = 44; // px across the whole photo while it sits on the page
	const STAGE = 144; // px square it is drawn in: room to come closer and to spread out

	let sky = $state(null);
	let canvas = $state(null);
	let shadow = $state(null);
	let handle = $state(null);
	let shown = $state(false);
	let plain = $state(false); // no flying: reduced motion, or nothing to draw it with
	let fading = $state(false);

	/** What Enter on the butterfly does (and, when it is a still picture, reaching for it). */
	let shoo = () => {};

	onMount(() => {
		const ground = sky.offsetParent;
		if (!ground) return;
		let stopped = false;
		let undo = () => {};
		const unframe = frameSky(sky, ground);

		const moveHandle = (spot) => {
			handle.style.transform = `translate3d(${spot.x.toFixed(1)}px, ${spot.y.toFixed(1)}px, 0)`;
		};

		/** A still picture that swaps perch when reached for. */
		function settleForPlain() {
			plain = true;
			let here = 0;
			const spots = () => perchesIn(ground, perches).map((perch) => spotOn(perch, ground, 0));
			const sit = () => {
				const spot = spots()[here];
				if (!spot || !handle) return;
				moveHandle(spot);
				shown = true;
			};
			shoo = () => {
				const seen = viewOf(ground);
				const others = spots()
					.map((spot, index) => ({ spot, index }))
					.filter((other) => other.index !== here);
				const near = others.filter((other) => within(other.spot, seen));
				const choices = near.length ? near : others;
				if (fading || !choices.length) return;
				fading = true;
				setTimeout(() => {
					here = choices[Math.floor(Math.random() * choices.length)].index;
					sit();
					fading = false;
				}, 260);
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
				butterflies: [{ canvas, shadow, span: SPAN }],
				courts: true,
				arrives: true,
				onSettle: (_, spot) => moveHandle(spot),
				onShow: () => (shown = true)
			});
			if (!habitat) return settleForPlain();
			shoo = () => habitat.shoo(0);
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
<div bind:this={sky} class="sky" class:shown class:plain>
	<div class="origin">
		{#if !plain}
			<canvas bind:this={shadow} class="shadow" aria-hidden="true"></canvas>
			<canvas bind:this={canvas} class="monarch" aria-hidden="true"></canvas>
		{/if}
		<!-- For the keyboard: the cursor never gets this far, the butterfly has gone by then. -->
		<button
			bind:this={handle}
			type="button"
			class="handle"
			class:fading
			aria-label="A butterfly. Reach for it and it flies off."
			onclick={() => shoo()}
			onpointerenter={() => plain && shoo()}
		>
			{#if plain}
				<img src="/butterfly/monarch-small.webp" alt="" width="128" height="80" draggable="false" />
			{/if}
		</button>
	</div>
</div>

<style>
	.sky {
		position: absolute;
		top: calc(-1 * var(--sky-up, 0px));
		right: calc(-1 * var(--sky-right, 0px));
		bottom: calc(-1 * var(--sky-below, 0px));
		left: calc(-1 * var(--sky-left, 0px));
		z-index: 5;
		overflow: hidden;
		overflow: clip;
		pointer-events: none;
	}

	/* The ground's own top left corner: what the butterfly's coordinates are measured from. */
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
	.handle {
		position: absolute;
		top: 0;
		left: 0;
	}

	canvas {
		width: 144px;
		height: 144px;
		will-change: transform;
	}

	/* Where it last sat. It stays put; the butterfly may not. */
	.handle {
		width: 2.75rem;
		height: 2.75rem;
		margin: -1.375rem 0 0 -1.375rem;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: none;
		-webkit-tap-highlight-color: transparent;
	}

	.handle:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: -4px;
	}

	.plain .handle {
		display: grid;
		place-items: center;
		cursor: pointer;
		pointer-events: auto;
		transition: opacity 240ms ease;
	}

	.plain .handle.fading {
		opacity: 0;
	}

	@media print {
		.sky {
			display: none;
		}
	}

	img {
		width: 2.4rem;
		height: auto;
		transform: rotate(-18deg);
		filter: drop-shadow(0 2px 2px rgb(28 25 23 / 0.2));
	}
</style>
