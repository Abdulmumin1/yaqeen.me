<script>
	import { onMount } from 'svelte';
	import { highlight } from '@highlighters/core';
	import { createFlight } from '$lib/butterfly/flight.js';
	import { createMonarch, SOURCE_WIDTH } from '$lib/butterfly/monarch.js';
	import { loadAtlas } from '$lib/butterfly/habitat.js';

	/**
	 * The picture a link to the site unfurls into (static/og.png): the nickname
	 * as the home page writes it, marker line and all, with the monarch sitting
	 * on the end of it. Shown at /og/preview and photographed from there at
	 * 1200 x 630 by scripts/capture-og.mjs. (A post's card is drawn on request
	 * instead, by $lib/server/og/postCard.js.)
	 *
	 * The root gets `data-ready` once the butterfly is drawn and the marker has
	 * finished its line, so whatever photographs it knows when to.
	 */

	const SPAN = 150; // px across the whole butterfly photo
	const STAGE = 210; // px square it is drawn in
	const TILT = 0.42; // radians clockwise: it faces up and along the word

	let card = $state(null);
	let word = $state(null);
	let butterfly = $state(null);
	let shadow = $state(null);
	let ready = $state(false);

	onMount(() => {
		let monarch = null;
		let mark = null;
		let stopped = false;

		// Once the type is in, so the marker and the butterfly both measure the real letters.
		Promise.all([loadAtlas(), document.fonts.ready]).then(([atlas]) => {
			if (stopped) return;
			// Mounted in the card rather than the page, so it goes wherever the card is shown.
			mark = highlight(
				word,
				{
					markType: 'underline',
					color: '#f9411f',
					opacity: 0.55,
					vivid: true,
					renderer: 'css',
					tip: { angle: 100, overshoot: 13 },
					ink: { flow: 1, feathering: 1, streakiness: 1 },
					edge: { waviness: 1, roughness: 1, cap: 'round' },
					animation: { duration: 300, trigger: 'immediate' }
				},
				card
			);
			monarch = createMonarch(atlas);
			if (monarch) perch(monarch);
			setTimeout(() => (ready = true), 600);
		});

		/** Where the top of the last letter is: the butterfly stands on it. */
		function lastLetterTop() {
			const text = word.firstChild;
			const range = document.createRange();
			range.setStart(text, text.length - 1);
			range.setEnd(text, text.length);
			const glyph = range.getBoundingClientRect();

			const style = getComputedStyle(word);
			const pen = document.createElement('canvas').getContext('2d');
			pen.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
			const letter = pen.measureText(text.data.at(-1));
			// The glyph's box is the font's own height, ascent above the baseline.
			const top = glyph.top + letter.fontBoundingBoxAscent - letter.actualBoundingBoxAscent;
			return { x: glyph.left + glyph.width * 0.62, y: top };
		}

		/** Sit it on the shoulder of the n, wings half up, the way it rests between flights. */
		function perch(monarch) {
			const density = window.devicePixelRatio || 1;
			monarch.resize(STAGE, density * 2);
			butterfly.width = butterfly.height = Math.round(STAGE * density * 2);
			shadow.width = shadow.height = Math.round(STAGE * density);

			const flight = createFlight({ random: () => 0.5 });
			flight.perch({ x: 0, y: 0, tilt: TILT });
			const wing = { root: 0.5, tip: 0.55, rootTrail: 0.46, tipTrail: 0.52, sweep: 0.03 };
			const pose = { ...flight.pose(), left: wing, right: wing };
			const scale = SPAN / SOURCE_WIDTH;

			monarch.drawShadow(shadow.getContext('2d'), pose, scale);
			monarch.draw(butterfly.getContext('2d'), { ...pose, scale });

			const spot = lastLetterTop();
			const origin = card.getBoundingClientRect();
			// Its hindwings come down to the letter; the rest of it is above.
			const x = spot.x - origin.left - STAGE / 2;
			const y = spot.y - origin.top - STAGE / 2 - SPAN * 0.24;
			butterfly.style.transform = `translate(${x}px, ${y}px)`;
			shadow.style.transform = `translate(${x + 3}px, ${y + 6}px)`;
		}

		return () => {
			stopped = true;
			mark?.remove();
			monarch?.destroy();
		};
	});
</script>

<div bind:this={card} class="card" data-ready={ready || undefined}>
	<p class="name"><span bind:this={word}>yaqeen</span></p>

	<canvas bind:this={shadow} class="shadow" aria-hidden="true"></canvas>
	<canvas bind:this={butterfly} aria-hidden="true"></canvas>
</div>

<style>
	.card {
		position: relative;
		width: 1200px;
		height: 630px;
		overflow: hidden;
		background: var(--color-surface);
	}

	.name {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		margin: 0;
		padding-bottom: 12px;
		color: var(--color-accent);
		font-family: var(--site-font-display);
		font-size: 184px;
		line-height: 1;
		letter-spacing: -0.01em;
	}

	canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 210px;
		height: 210px;
		/* Chrome draws a faint line along a translated canvas's edges; the butterfly is nowhere near them. */
		clip-path: inset(6px);
	}

	.shadow {
		opacity: 0.22;
		filter: blur(3px);
	}
</style>
