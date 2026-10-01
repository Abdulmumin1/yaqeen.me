<script>
	import { onMount } from 'svelte';

	/**
	 * A monarch that rests on a section heading and, when you reach for it,
	 * flutters off to settle on another one. It positions itself against its
	 * nearest positioned ancestor and lands on that ancestor's `perches`.
	 *
	 * @typedef {Object} Props
	 * @property {string} [perches] - Selector for the headings it may land on.
	 */

	/** @type {Props} */
	let { perches = 'h2' } = $props();

	const REST_TILT = -18;

	let body = $state(null);
	let flying = $state(false);
	let settled = $state(false);
	let perch = 0;
	let wary = false;

	function spotOn(index) {
		const ground = body.offsetParent;
		const heading = ground?.querySelectorAll(perches)[index];
		if (!heading) return null;

		// Measure the words, not the full-width heading box, and land just past the last one.
		const words = document.createRange();
		words.selectNodeContents(heading);
		const text = words.getBoundingClientRect();
		const origin = ground.getBoundingClientRect();
		return { x: text.right - origin.left + 6, y: text.top - origin.top - 5 };
	}

	const pose = ({ x, y }, tilt) =>
		`translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${tilt.toFixed(1)}deg)`;

	function land() {
		const spot = spotOn(perch);
		if (!spot) return;
		body.style.transform = pose(spot, REST_TILT);
		settled = true;
	}

	function startle() {
		if (flying || wary || !settled) return;
		const count = body.offsetParent.querySelectorAll(perches).length;
		if (count < 2) return;

		const from = spotOn(perch);
		let next = perch;
		while (next === perch) next = Math.floor(Math.random() * count);
		const to = spotOn(next);
		perch = next;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			land();
			return;
		}

		// Up and away in a lazy arc, nose pointing where it is headed.
		const distance = Math.hypot(to.x - from.x, to.y - from.y);
		const swerve = (Math.random() < 0.5 ? -1 : 1) * (40 + Math.random() * 50);
		const peak = {
			x: (from.x + to.x) / 2 + swerve,
			y: Math.min(from.y, to.y) - 46 - Math.random() * 30
		};
		const heading = (a, b) => (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;

		flying = true;
		const flight = body.animate(
			[
				{ transform: pose(from, REST_TILT) },
				{ transform: pose(peak, heading(from, peak) * 0.6), offset: 0.42 },
				{ transform: pose(to, REST_TILT) }
			],
			{
				duration: Math.min(Math.max(distance * 2.2, 900), 1900),
				easing: 'cubic-bezier(0.4, 0.1, 0.3, 1)'
			}
		);
		body.style.transform = pose(to, REST_TILT);
		flight.finished
			.catch(() => {})
			.then(() => {
				flying = false;
				// Give it a moment before it can be chased off again.
				wary = true;
				setTimeout(() => (wary = false), 500);
			});
	}

	onMount(() => {
		const ground = body.offsetParent;
		const watcher = new ResizeObserver(() => !flying && land());
		watcher.observe(ground);
		document.fonts.ready.then(land);
		return () => watcher.disconnect();
	});
</script>

<button
	bind:this={body}
	type="button"
	class="butterfly"
	class:settled
	class:flying
	aria-label="A butterfly. Reach for it and it flies off."
	onpointerenter={startle}
	onclick={startle}
>
	<img src="/butterfly/monarch-small.webp" alt="" width="128" height="80" draggable="false" />
</button>

<style>
	.butterfly {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 5;
		width: 1.9rem;
		padding: 0.5rem;
		margin: -0.5rem;
		border: 0;
		background: none;
		box-sizing: content-box;
		opacity: 0;
		cursor: pointer;
		transform-origin: 50% 60%;
		transition: opacity 600ms ease;
		-webkit-tap-highlight-color: transparent;
	}

	.butterfly.settled {
		opacity: 1;
	}

	img {
		display: block;
		width: 100%;
		height: auto;
		filter: drop-shadow(0 2px 2px rgb(28 25 23 / 0.2));
		/* Mostly still, with a slow open-and-close of the wings now and then. */
		animation: breathe 5.5s ease-in-out infinite;
	}

	.flying img {
		animation: flap 150ms ease-in-out infinite alternate;
	}

	@keyframes breathe {
		0%,
		78%,
		100% {
			transform: scaleX(1);
		}
		84% {
			transform: scaleX(0.55);
		}
		90% {
			transform: scaleX(0.95);
		}
		95% {
			transform: scaleX(0.6);
		}
	}

	@keyframes flap {
		from {
			transform: scaleX(1);
		}
		to {
			transform: scaleX(0.18);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		img,
		.flying img {
			animation: none;
		}
	}
</style>
