<script>
	import { onMount } from 'svelte';
	import { createFlight } from '$lib/butterfly/flight.js';
	import { createMonarch, SHADOW_DRIFT, SOURCE_WIDTH } from '$lib/butterfly/monarch.js';

	/**
	 * A monarch that lives on the page.
	 *
	 * It basks at the end of a section heading. Come at it with the cursor and
	 * it gets nervous, then goes: the faster you close in, the sooner. Creep up
	 * and you can nearly touch it. It flutters off to another heading, wanders
	 * about of its own accord now and then, follows you down the page when you
	 * scroll away, starts when the lights go on or off, and if you leave the
	 * cursor lying still for long enough it may well come and sit on it.
	 *
	 * How it flies is in $lib/butterfly/flight.js and how it is drawn is in
	 * $lib/butterfly/monarch.js; this file is where it meets the page. It
	 * positions itself against its nearest positioned ancestor and lands on
	 * that ancestor's `perches`.
	 *
	 * @typedef {Object} Props
	 * @property {string} [perches] - Selector for the headings it may land on.
	 */

	/** @type {Props} */
	let { perches = 'h2' } = $props();

	const SPAN = 44; // px across the whole photo while it sits on the page
	const STAGE = 144; // px square it is drawn in: room to come closer and to spread out
	const SCALE = SPAN / SOURCE_WIDTH;
	const WARY = 110; // px beyond bolting distance at which it starts to mind the cursor
	const CROWDED = 120; // it will not land this close to the cursor
	const SHAKEN_OFF = 420; // px/s: carry it faster than this and it lets go

	let sky = $state(null);
	let canvas = $state(null);
	let shadow = $state(null);
	let handle = $state(null);
	let shown = $state(false);
	let away = $state(false); // not on its heading, so there is nothing there to reach for
	let plain = $state(false); // no flying: reduced motion, or nothing to draw it with
	let fading = $state(false);

	/** What a click (or Enter) on the butterfly does; set once it is alive. */
	let shoo = () => {};

	const between = (low, high) => low + Math.random() * (high - low);
	const clamp = (value, low, high) => Math.min(Math.max(value, low), high);
	const pick = (list) => list[Math.floor(Math.random() * list.length)];
	const lean = () => between(-0.5, 0.22);

	onMount(() => {
		const ground = sky.offsetParent;
		if (!ground) return;

		const tidy = [];
		const listen = (target, type, handler, options) => {
			target.addEventListener(type, handler, options);
			tidy.push(() => target.removeEventListener(type, handler, options));
		};
		let stopped = false;
		let here = 0; // which heading it is on, or making for (-1: none of them)

		const headings = () => [...ground.querySelectorAll(perches)];

		/** Just past the last word of a heading, in the ground's coordinates. */
		function spotOn(index, tilt = lean()) {
			const heading = headings()[index];
			if (!heading) return null;
			const words = document.createRange();
			words.selectNodeContents(heading);
			const text = words.getBoundingClientRect();
			const origin = ground.getBoundingClientRect();
			return { x: text.right - origin.left + 27, y: text.top - origin.top + 5, tilt };
		}

		/** The part of the ground the reader can see. */
		function view() {
			const origin = ground.getBoundingClientRect();
			return {
				left: -origin.left,
				top: -origin.top,
				right: -origin.left + document.documentElement.clientWidth,
				bottom: -origin.top + window.innerHeight
			};
		}
		const inView = (spot, seen = view()) =>
			spot.y > seen.top + 24 &&
			spot.y < seen.bottom - 24 &&
			spot.x > seen.left &&
			spot.x < seen.right;

		// The reader's cursor: where it is in the window, and its velocity in px/s.
		let cursor = null;
		const cursorOnGround = () => {
			if (!cursor) return null;
			const origin = ground.getBoundingClientRect();
			return { x: cursor.x - origin.left, y: cursor.y - origin.top };
		};
		const cursorPace = () =>
			cursor && performance.now() - cursor.at < 90 ? Math.hypot(cursor.vx, cursor.vy) : 0;

		/** Another heading to sit on: in sight and away from the cursor if it can be. */
		function elsewhere() {
			const seen = view();
			const mouse = cursorOnGround();
			const options = headings()
				.map((_, index) => ({ index, spot: spotOn(index) }))
				.filter((option) => option.spot && option.index !== here);
			if (!options.length) return { index: here, spot: spotOn(here) };
			const clear = (option) =>
				!mouse || Math.hypot(option.spot.x - mouse.x, option.spot.y - mouse.y) > CROWDED;
			const best = [
				options.filter((option) => inView(option.spot, seen) && clear(option)),
				options.filter((option) => inView(option.spot, seen)),
				options.filter(clear)
			].find((list) => list.length);
			return pick(best ?? options);
		}

		/**
		 * Somewhere to wander past on the way from one spot to another: off to
		 * one side of the straight line, wherever there is room and no cursor.
		 */
		function detour(from, to) {
			const seen = view();
			const mouse = cursorOnGround();
			const length = Math.hypot(to.x - from.x, to.y - from.y);
			const stops = length > 520 && Math.random() < 0.45 ? 2 : Math.random() < 0.85 ? 1 : 0;
			const points = [];
			for (let n = 0; n < stops; n += 1) {
				const along = (n + between(0.35, 0.7)) / stops;
				for (let attempt = 0; attempt < 6; attempt += 1) {
					const side = Math.random() < 0.5 ? -1 : 1;
					const point = {
						x: clamp(
							from.x + (to.x - from.x) * along + side * between(110, 280),
							seen.left + 50,
							seen.right - 50
						),
						y: clamp(
							from.y + (to.y - from.y) * along + between(-120, 60),
							seen.top + 70,
							seen.bottom - 70
						)
					};
					if (mouse && Math.hypot(point.x - mouse.x, point.y - mouse.y) < 170) continue;
					points.push(point);
					break;
				}
			}
			return points;
		}

		// ------------------------------------------------- without the flying

		function settleForPlain() {
			plain = true;
			const sit = () => {
				const spot = spotOn(here, 0);
				if (!spot || !handle) return;
				handle.style.transform = `translate3d(${spot.x.toFixed(1)}px, ${spot.y.toFixed(1)}px, 0)`;
				shown = true;
			};
			shoo = () => {
				if (fading || headings().length < 2) return;
				fading = true;
				setTimeout(() => {
					here = elsewhere().index;
					sit();
					fading = false;
				}, 260);
			};
			const watcher = new ResizeObserver(sit);
			watcher.observe(ground);
			tidy.push(() => watcher.disconnect());
			document.fonts.ready.then(() => requestAnimationFrame(sit));
		}

		// ---------------------------------------------------- with the flying

		function comeAlive(atlas) {
			const monarch = createMonarch(canvas, atlas);
			if (!monarch) return settleForPlain();
			tidy.push(() => monarch.destroy());

			const flight = createFlight();
			const ink = shadow.getContext('2d');
			let frame = 0;
			let last = 0;
			let asleepSince = 0;
			let blur = -1;
			let checked = 0;
			let courting = false; // on its way to the reader's cursor
			let riding = false; // sitting on it
			const timers = { stir: 0, restless: 0, follow: 0, calm: 0 };

			function fit() {
				const density = window.devicePixelRatio || 1;
				// Drawn larger than shown, so the pattern stays as crisp as the photo.
				monarch.resize(STAGE, density * (density >= 3 ? 1.34 : 2));
				const pixels = Math.round(STAGE * Math.min(density, 2));
				if (shadow.width !== pixels) shadow.width = shadow.height = pixels;
			}

			function draw() {
				const pose = flight.pose();
				// The shadow goes first: it borrows the main canvas to be drawn.
				monarch.drawShadow(ink, pose, SCALE);
				monarch.draw({ ...pose, scale: SCALE * pose.zoom });

				const half = STAGE / 2;
				canvas.style.transform = `translate3d(${(pose.x - half).toFixed(2)}px, ${(pose.y - half).toFixed(2)}px, 0)`;
				// Its shadow slides out from under it as it leaves the page, and softens.
				const off = pose.height;
				const sx = pose.x + 1 + SHADOW_DRIFT[0] * off - half;
				const sy = pose.y + 2 + SHADOW_DRIFT[1] * off - half;
				shadow.style.transform = `translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, 0)`;
				shadow.style.opacity = (0.25 / (1 + off / 60)).toFixed(3);
				const soft = Math.round((1 + off * 0.07) * 2) / 2;
				if (soft !== blur) {
					blur = soft;
					shadow.style.filter = `blur(${soft}px)`;
				}
				shown = true;
			}

			/** On the tip of the cursor, like the end of a twig. */
			function onCursor() {
				const mouse = cursorOnGround();
				return mouse && { x: mouse.x + 1, y: mouse.y - 9 };
			}

			function tick(now) {
				frame = 0;
				if (stopped) return;
				const elapsed = Math.min((now - last) / 1000, 0.05);
				last = now;
				const was = flight.mode;

				if (courting) {
					// It only wants the cursor while the cursor keeps (nearly) still.
					const spot = onCursor();
					if (spot && cursorPace() < 260) {
						flight.follow({ ...spot, tilt: flight.target.tilt });
					} else {
						courting = false;
						const other = elsewhere();
						here = other.index;
						if (other.spot) flight.retarget(other.spot);
					}
				} else if (flight.mode === 'flying' && now - checked > 350) {
					// Is someone hovering over the heading it is making for? Pick another.
					checked = now;
					const mouse = cursorOnGround();
					const target = flight.target;
					if (mouse && Math.hypot(target.x - mouse.x, target.y - mouse.y) < CROWDED) {
						const other = elsewhere();
						if (other.index !== here && other.spot) {
							here = other.index;
							flight.retarget(other.spot);
						}
					}
				}

				const seen = view();
				flight.step(elapsed, {
					pointer: courting ? null : cursorOnGround(),
					bounds: { left: seen.left + 6, right: seen.right - 6 }
				});
				if (was !== 'perched' && flight.mode === 'perched') landed();

				draw();
				if (flight.still) nap();
				else frame = requestAnimationFrame(tick);
			}

			function wake() {
				clearTimeout(timers.stir);
				if (frame || stopped || document.hidden) return;
				if (asleepSince) flight.doze((performance.now() - asleepSince) / 1000);
				asleepSince = 0;
				last = performance.now();
				frame = requestAnimationFrame(tick);
			}

			/** Nothing is moving: stop drawing until it next stirs. */
			function nap() {
				asleepSince ||= performance.now();
				clearTimeout(timers.stir);
				timers.stir = setTimeout(
					() => {
						// No point fanning its wings where nobody can see.
						if (inView(flight.target)) wake();
						else nap();
					},
					Math.max(flight.nextStir, 0.2) * 1000
				);
			}

			function moveHandle(spot) {
				handle.style.transform = `translate3d(${spot.x.toFixed(1)}px, ${spot.y.toFixed(1)}px, 0)`;
			}

			function landed() {
				clearTimeout(timers.restless);
				if (courting) {
					courting = false;
					riding = true;
					here = -1;
					timers.restless = setTimeout(wanderOff, between(12, 26) * 1000);
					return;
				}
				moveHandle(flight.target);
				away = false;
				timers.restless = setTimeout(wanderOff, between(22, 55) * 1000);
			}

			/** Off to another heading: scared by something at `from`, or (without) in its own time. */
			function leave(from = null) {
				if (flight.mode !== 'perched') return;
				const next = elsewhere();
				if (!next.spot) return;
				clearTimeout(timers.restless);
				riding = false;
				away = true;
				flight.flyTo(next.spot, from, detour(flight.target, next.spot));
				here = next.index;
				wake();
			}

			/** Up, round and back down where it was, facing another way. */
			function hop() {
				const spot = spotOn(here);
				if (!spot) return leave();
				const seen = view();
				const side = Math.random() < 0.5 ? -1 : 1;
				const out = {
					x: clamp(spot.x + side * between(110, 200), seen.left + 40, seen.right - 40),
					y: spot.y - between(60, 150)
				};
				away = true;
				flight.flyTo(spot, null, [out]);
				wake();
			}

			/** The cursor has not moved in a while. It will do to sit on. */
			function court() {
				const spot = onCursor();
				if (!spot) return leave();
				courting = true;
				away = true;
				flight.flyTo({ ...spot, tilt: between(-0.3, 0.1) }, null, detour(flight.target, spot));
				wake();
			}

			function wanderOff() {
				if (flight.mode !== 'perched' || document.hidden || !inView(flight.target)) {
					timers.restless = setTimeout(wanderOff, between(8, 16) * 1000);
					return;
				}
				const idle = cursor && performance.now() - cursor.at > 2500;
				if (!riding && idle && Math.random() < 0.55) court();
				else if (!riding && Math.random() < 0.4) hop();
				else leave();
			}

			/** The reader has scrolled it out of sight: come and find them. */
			function catchUp() {
				if (flight.mode !== 'perched' || riding || document.hidden) return;
				const seen = view();
				if (inView(flight.target, seen)) return;
				const near = headings()
					.map((_, index) => ({ index, spot: spotOn(index) }))
					.filter((option) => option.spot && inView(option.spot, seen));
				if (!near.length) return;
				const next = pick(near);
				// It comes in over whichever edge it was left behind.
				const above = flight.target.y < seen.top;
				const from = {
					x: clamp(next.spot.x + between(-260, 260), seen.left + 20, seen.right - 20),
					y: above ? seen.top - 30 : seen.bottom + 30
				};
				here = next.index;
				away = true;
				clearTimeout(timers.restless);
				flight.arrive(from, next.spot);
				wake();
			}

			/** Sitting on a heading with the cursor about: mind it, or go. */
			function notice() {
				const origin = ground.getBoundingClientRect();
				const spot = flight.target;
				const dx = spot.x - (cursor.x - origin.left);
				const dy = spot.y - (cursor.y - origin.top);
				const reach = Math.hypot(dx, dy) || 1;
				// What frightens it is being closed in on. Come straight at it quickly and it is
				// gone before you are near; pass by, or creep up, and you can almost touch it.
				const closing = Math.max(0, (cursor.vx * dx + cursor.vy * dy) / reach);
				const bolt = clamp(26 + closing * 0.12, 26, 150);
				if (reach < bolt) {
					leave({ x: cursor.x - origin.left, y: cursor.y - origin.top });
					return;
				}
				const wary = clamp(1 - (reach - bolt) / WARY, 0, 1);
				flight.setWary(wary * wary * (3 - 2 * wary));
				// It gets used to a cursor that just sits there.
				clearTimeout(timers.calm);
				if (wary > 0) timers.calm = setTimeout(relax, 1600);
				if (!flight.still) wake();
			}

			/** Sitting on the cursor while it moves: hold on, or let go. */
			function carry() {
				const spot = onCursor();
				const pace = cursorPace();
				if (!spot || pace > SHAKEN_OFF) return leave(cursorOnGround());
				flight.perch(spot);
				flight.setWary(clamp(pace / SHAKEN_OFF, 0, 1));
				clearTimeout(timers.calm);
				timers.calm = setTimeout(relax, 260);
				draw();
				wake();
			}

			function relax() {
				flight.setWary(0);
				if (!flight.still) wake();
			}

			listen(
				window,
				'pointermove',
				(event) => {
					if (event.pointerType === 'touch') return;
					const now = performance.now();
					let vx = 0;
					let vy = 0;
					if (cursor && now - cursor.at < 120) {
						const per = 1000 / Math.max(now - cursor.at, 1);
						vx = cursor.vx + ((event.clientX - cursor.x) * per - cursor.vx) * 0.4;
						vy = cursor.vy + ((event.clientY - cursor.y) * per - cursor.vy) * 0.4;
					}
					cursor = { x: event.clientX, y: event.clientY, vx, vy, at: now };
					if (flight.mode !== 'perched') return;
					if (riding) carry();
					else notice();
				},
				{ passive: true }
			);
			listen(document.documentElement, 'pointerleave', () => {
				cursor = null;
				if (riding) leave();
				else relax();
			});
			listen(
				window,
				'pointerdown',
				(event) => {
					if (flight.mode !== 'perched') return;
					const origin = ground.getBoundingClientRect();
					const point = { x: event.clientX - origin.left, y: event.clientY - origin.top };
					// A click is a jolt to anything sitting on the cursor. And a finger
					// has no hover, so a tap anywhere near sends it off.
					if (riding) leave(point);
					else if (event.pointerType === 'touch') {
						if (Math.hypot(point.x - flight.target.x, point.y - flight.target.y) < 64) leave(point);
					}
				},
				{ passive: true }
			);
			listen(
				window,
				'scroll',
				() => {
					if (riding && flight.mode === 'perched') {
						// The page moved under the cursor; it stays with the cursor.
						const spot = onCursor();
						if (spot) {
							flight.perch(spot);
							draw();
						}
					}
					clearTimeout(timers.follow);
					timers.follow = setTimeout(catchUp, between(2200, 3800));
				},
				{ passive: true }
			);
			listen(document, 'visibilitychange', () => {
				if (document.hidden) {
					cancelAnimationFrame(frame);
					frame = 0;
				} else {
					wake();
				}
			});

			// Pull the cord and the light changes: enough to startle anything with wings.
			let dark = document.documentElement.classList.contains('dark');
			const lights = new MutationObserver(() => {
				const now = document.documentElement.classList.contains('dark');
				if (now === dark) return;
				dark = now;
				if (flight.mode !== 'perched' || !inView(flight.target)) return;
				leave({ x: flight.target.x + between(-20, 20), y: flight.target.y + 40 });
			});
			lights.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

			/** The page has reflowed: keep it on its heading, or still making for it. */
			function stayPut() {
				fit();
				const spot = riding || courting || here < 0 ? null : spotOn(here, flight.target.tilt);
				if (spot && flight.mode === 'perched') {
					flight.perch({ x: spot.x, y: spot.y });
					moveHandle(spot);
				} else if (spot && flight.mode !== 'windup') {
					flight.follow(spot);
				}
				draw();
			}
			const watcher = new ResizeObserver(stayPut);
			watcher.observe(ground);
			// Zooming changes how many pixels it needs without the page changing size.
			listen(window, 'resize', stayPut, { passive: true });
			listen(canvas, 'webglcontextrestored', draw);

			tidy.push(() => {
				cancelAnimationFrame(frame);
				Object.values(timers).forEach(clearTimeout);
				watcher.disconnect();
				lights.disconnect();
			});

			shoo = (event) => {
				// A real click scares it from where the click was; the keyboard just asks it to move on.
				if (!event?.detail) return leave();
				const origin = ground.getBoundingClientRect();
				leave({ x: event.clientX - origin.left, y: event.clientY - origin.top });
			};

			// Begin: fly in to the first heading in sight, or be found sitting on the first of all.
			fit();
			const seen = view();
			const spots = headings().map((_, index) => spotOn(index));
			const first = spots.findIndex((spot) => inView(spot, seen));
			if (first >= 0) {
				here = first;
				away = true;
				const from = {
					x: Math.min(spots[first].x + between(260, 420), seen.right - 40),
					y: seen.top - 30
				};
				flight.arrive(from, spots[first]);
				wake();
			} else if (spots.length) {
				flight.perch(spots[0]);
				moveHandle(spots[0]);
				draw();
				nap();
				timers.restless = setTimeout(wanderOff, between(22, 55) * 1000);
			}
		}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			settleForPlain();
		} else {
			const atlas = new Image();
			atlas.src = '/butterfly/monarch-atlas.webp';
			Promise.all([atlas.decode(), document.fonts.ready]).then(
				() => !stopped && comeAlive(atlas),
				() => !stopped && settleForPlain()
			);
		}

		return () => {
			stopped = true;
			tidy.forEach((undo) => undo());
		};
	});
</script>

<div bind:this={sky} class="sky" class:shown class:plain>
	{#if !plain}
		<canvas bind:this={shadow} class="shadow" aria-hidden="true"></canvas>
		<canvas bind:this={canvas} class="monarch" aria-hidden="true"></canvas>
	{/if}
	<button
		bind:this={handle}
		type="button"
		class="handle"
		class:away
		class:fading
		aria-label="A butterfly. Reach for it and it flies off."
		onclick={(event) => shoo(event)}
		onpointerenter={() => plain && shoo()}
	>
		{#if plain}
			<img src="/butterfly/monarch-small.webp" alt="" width="128" height="80" draggable="false" />
		{/if}
	</button>
</div>

<style>
	.sky {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 5;
		width: 0;
		height: 0;
		opacity: 0;
		pointer-events: none;
		transition: opacity 500ms ease;
	}

	.sky.shown {
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

	/* What you reach for. It stays on the heading; the butterfly may not. */
	.handle {
		width: 2.75rem;
		height: 2.75rem;
		margin: -1.375rem 0 0 -1.375rem;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: none;
		cursor: pointer;
		pointer-events: auto;
		-webkit-tap-highlight-color: transparent;
	}

	.handle.away {
		pointer-events: none;
	}

	.handle:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: -4px;
	}

	.plain .handle {
		display: grid;
		place-items: center;
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
