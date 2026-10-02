<script>
	import { onMount } from 'svelte';
	import { createBed } from '$lib/garden/bed.js';

	/**
	 * A bed of flowers standing along the bottom edge of whatever box this is
	 * put in (it fills its nearest positioned ancestor). Bare until the reader
	 * first sees it; then it comes up, flowers, and stands swaying in a breeze.
	 * Drag the cursor through and the plants go with it.
	 *
	 * Each flower head is also somewhere a butterfly can sit: the bed keeps a
	 * marker on every open flower (data-perch, see $lib/butterfly/habitat.js)
	 * and the stem dips when something lands there.
	 *
	 * How the plants are drawn and how they move is in $lib/garden/bed.js.
	 */

	const SEATS = 8; // as many markers as the fullest bed has plants

	let root = $state(null);
	let canvas = $state(null);
	let seats = $state([]);

	onMount(() => {
		const bed = createBed(canvas);
		const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const night = () => document.documentElement.classList.contains('dark');
		let frame = 0;
		let last = 0;
		let seen = false;
		let planted = false;
		let hand = null; // the cursor, in the bed's own coordinates, and how fast it is going

		/** Keep a marker on every open flower, for the butterflies. */
		const marked = [];
		function mark() {
			const blooms = bed.blooms();
			seats.forEach((seat, n) => {
				const open = Boolean(blooms[n]?.open);
				if (open !== marked[n]) {
					marked[n] = open;
					if (open) seat.dataset.perch = '50% 50%';
					else delete seat.dataset.perch;
				}
				if (!open) return;
				const { x, y } = blooms[n];
				seat.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
			});
		}

		function fit() {
			const { width, height } = root.getBoundingClientRect();
			if (width < 40 || height < 40) return;
			bed.layout(width, height, Math.min(window.devicePixelRatio || 1, 2.5), night());
			// Nothing shows until someone is there to watch it grow.
			if (!planted && !still) bed.grow();
			planted = true;
			bed.draw();
			mark();
		}

		function tick(now) {
			frame = 0;
			const elapsed = Math.min((now - last) / 1000, 0.05);
			last = now;
			bed.step(elapsed, hand && now - hand.at < 120 ? hand : null);
			bed.draw();
			mark();
			if (seen && !document.hidden) frame = requestAnimationFrame(tick);
		}

		function wake() {
			if (frame || still || !seen || document.hidden) return;
			last = performance.now();
			frame = requestAnimationFrame(tick);
		}

		const onMove = (event) => {
			if (event.pointerType === 'touch' || !seen) return;
			const box = root.getBoundingClientRect();
			const now = performance.now();
			const x = event.clientX - box.left;
			const y = event.clientY - box.top;
			let vx = 0;
			let vy = 0;
			if (hand && now - hand.at < 120) {
				const per = 1000 / Math.max(now - hand.at, 1);
				vx = hand.vx + ((x - hand.x) * per - hand.vx) * 0.5;
				vy = hand.vy + ((y - hand.y) * per - hand.vy) * 0.5;
			}
			hand = { x, y, vx, vy, at: now };
		};

		const watcher = new ResizeObserver(fit);
		watcher.observe(root);
		const sight = new IntersectionObserver(
			([entry]) => {
				seen = entry.isIntersecting;
				wake();
			},
			{ threshold: 0.15 }
		);
		sight.observe(root);
		const lights = new MutationObserver(() => {
			bed.setNight(night());
			if (still) bed.draw();
		});
		lights.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
		window.addEventListener('pointermove', onMove, { passive: true });
		document.addEventListener('visibilitychange', wake);
		seats.forEach((seat, n) => {
			seat.addEventListener('butterfly:land', () => bed.land(n));
			seat.addEventListener('butterfly:leave', () => bed.leave(n));
		});
		fit();

		return () => {
			cancelAnimationFrame(frame);
			watcher.disconnect();
			sight.disconnect();
			lights.disconnect();
			window.removeEventListener('pointermove', onMove);
			document.removeEventListener('visibilitychange', wake);
		};
	});
</script>

<div bind:this={root} class="bed" aria-hidden="true">
	<canvas bind:this={canvas}></canvas>
	{#each { length: SEATS }, n (n)}
		<i bind:this={seats[n]} class="seat" data-perch-live></i>
	{/each}
</div>

<style>
	.bed {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.seat {
		position: absolute;
		top: 0;
		left: 0;
		width: 1px;
		height: 1px;
	}

	@media print {
		.bed {
			display: none;
		}
	}
</style>
