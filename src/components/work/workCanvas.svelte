<script>
	import { onMount, untrack } from 'svelte';

	/**
	 * A board you are walked around. Whatever is passed in is laid out once, at
	 * full size, and a camera moves over it. Each element inside marked
	 * `data-stop` is a stop on the walk, in document order: the camera frames
	 * one at a time and the rest of the board steps back.
	 *
	 * You can leave the walk whenever you like: drag (mouse, pen or finger),
	 * scroll or swipe a trackpad to pan, pinch or ctrl-scroll to zoom. The walk
	 * waits where you left it.
	 *
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} children
	 * @property {string} [label]
	 * @property {number} [inset] - Pixels at the foot of the window to keep clear, for a caption.
	 * @property {number} [stop] - The stop the walk is at. Bindable.
	 * @property {number} [count] - How many stops there are. Bindable; set by the board.
	 * @property {boolean} [wandering] - Whether the board has been moved off the stop by hand. Bindable.
	 * @property {number} [zoom] - The camera's zoom. Bindable; set by the board.
	 */

	/** @type {Props} */
	let {
		children,
		label = 'Canvas',
		inset = 0,
		stop = $bindable(0),
		count = $bindable(0),
		wandering = $bindable(false),
		zoom: scale = $bindable(1)
	} = $props();

	const MAX_SCALE = 1.6;
	const FRICTION = 0.92;
	// Framing a stop, never closer than life size; if the whole of it would be
	// smaller than this, it is framed across instead.
	const READABLE = 0.6;

	let viewport = $state(null);
	let world = $state(null);

	// The camera: where the board's top-left corner sits in the window, and the zoom.
	let camX = $state(0);
	let camY = $state(0);

	let top = $state(0);
	let ready = $state(false);
	let dragging = $state(false);

	// Sizes, in CSS pixels: the window onto the board, and the board unzoomed.
	let view = { w: 0, h: 0 };
	let board = { w: 0, h: 0 };

	let stops = [];
	let frame = 0;
	let pointers = new Map();
	let gesture = null;
	let pinch = null;
	let suppressClick = false;

	function reducedMotion() {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	function rem() {
		return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
	}

	// Never closer than 160%, never further out than it takes to see all of it
	// above the caption, with a little to spare.
	function minScale() {
		if (!board.w || !board.h) return 0.25;
		const fit = Math.min(view.w / board.w, Math.max(1, view.h - inset) / board.h);
		return Math.max(0.05, Math.min(fit * 0.85, 0.6));
	}

	function clampScale(value) {
		return Math.min(MAX_SCALE, Math.max(minScale(), value));
	}

	// Keep a good part of the board in the window, however far it is thrown.
	function clampAxis(position, viewSize, extent) {
		const keep = Math.min(view.w, view.h) * 0.3;
		const low = keep - extent;
		const high = viewSize - keep;
		if (low > high) return (viewSize - extent) / 2;
		return Math.min(high, Math.max(low, position));
	}

	function clamped(x, y, s) {
		return [clampAxis(x, view.w, board.w * s), clampAxis(y, view.h, board.h * s), s];
	}

	function setCamera(x, y, s = scale, clamp = true) {
		[camX, camY, scale] = clamp ? clamped(x, y, s) : [x, y, s];
	}

	function stopMotion() {
		cancelAnimationFrame(frame);
		frame = 0;
	}

	// The point on the board at the middle of the window, for a given camera.
	function centreOf(x, y, s) {
		return [(view.w / 2 - x) / s, (view.h / 2 - y) / s];
	}

	/* Glide to a camera position, easing in and out. The middle of the window
	   travels in a straight line across the board while the zoom changes, and a
	   long way pulls back a little on the way, so you see where you are going.
	   Any touch of the board interrupts it. */
	function flyTo(x, y, s, duration = 650, done) {
		stopMotion();
		const [toX, toY, toS] = clamped(x, y, s);
		if (reducedMotion()) {
			setCamera(toX, toY, toS);
			done?.();
			return;
		}
		const fromS = scale;
		const [ax, ay] = centreOf(camX, camY, fromS);
		const [bx, by] = centreOf(toX, toY, toS);
		const distance = Math.hypot(bx - ax, by - ay) * Math.min(fromS, toS);
		const lift = Math.min(0.45, distance / (Math.max(view.w, view.h) * 3));
		const start = performance.now();
		const step = (now) => {
			const t = Math.min(1, (now - start) / duration);
			const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
			const s = fromS * Math.pow(toS / fromS, ease) * (1 - lift * Math.sin(Math.PI * ease));
			const cx = ax + (bx - ax) * ease;
			const cy = ay + (by - ay) * ease;
			setCamera(view.w / 2 - cx * s, view.h / 2 - cy * s, s, false);
			if (t < 1) frame = requestAnimationFrame(step);
			else {
				setCamera(toX, toY, toS, false);
				frame = 0;
				done?.();
			}
		};
		frame = requestAnimationFrame(step);
	}

	// A fling keeps going for a moment after the finger lifts.
	function glide(vx, vy) {
		if (reducedMotion()) return settle();
		const step = () => {
			vx *= FRICTION;
			vy *= FRICTION;
			if (Math.hypot(vx, vy) < 0.35) {
				frame = 0;
				settle();
				return;
			}
			setCamera(camX + vx, camY + vy);
			frame = requestAnimationFrame(step);
		};
		frame = requestAnimationFrame(step);
	}

	function zoomAt(px, py, next) {
		const s = clampScale(next);
		const k = s / scale;
		setCamera(px - (px - camX) * k, py - (py - camY) * k, s);
	}

	function zoomBy(factor) {
		const s = clampScale(scale * factor);
		const k = s / scale;
		const cx = view.w / 2;
		const cy = view.h / 2;
		flyTo(cx - (cx - camX) * k, cy - (cy - camY) * k, s, 280, settle);
	}

	// Where an element sits on the unzoomed board.
	function boardRectOf(element) {
		const origin = world.getBoundingClientRect();
		const box = element.getBoundingClientRect();
		return {
			x: (box.left - origin.left) / scale,
			y: (box.top - origin.top) / scale,
			w: box.width / scale,
			h: box.height / scale
		};
	}

	function local(event) {
		const box = viewport.getBoundingClientRect();
		return [event.clientX - box.left, event.clientY - box.top];
	}

	/* ---- The walk ----------------------------------------------------- */

	/* The camera that frames an element: all of it, as large as it will go up
	   to life size, in the window above the caption. Something too tall to fit
	   at a size you can read is framed across instead, from its top, and the
	   rest is a scroll away. */
	function frameOf(element) {
		const box = boardRectOf(element);
		const pad = (view.w >= 48 * rem() ? 2.5 : 1) * rem();
		const room = { w: view.w - pad * 2, h: view.h - inset - pad * 2 };
		const across = Math.min(1, room.w / box.w);
		const whole = Math.min(across, room.h / box.h);
		const s = clampScale(whole >= READABLE ? whole : across);
		const x = pad + (room.w - box.w * s) / 2 - box.x * s;
		const fits = box.h * s <= room.h + 1;
		const y = (fits ? pad + (room.h - box.h * s) / 2 : pad) - box.y * s;
		return [x, y, s];
	}

	export function goTo(index) {
		if (!stops.length) return;
		stop = Math.max(0, Math.min(stops.length - 1, index));
		wandering = false;
		flyTo(...frameOf(stops[stop]), 1100);
	}

	/* Once the board has been moved by hand and comes to rest, the walk picks
	   up at the stop that is mostly in the window, if there is one, and
	   otherwise waits where it was. */
	function settle() {
		const index = nearestStop();
		if (index === -1) {
			wandering = true;
			return;
		}
		stop = index;
		const [x, y, s] = frameOf(stops[index]);
		// Close to where the walk would put it is as good as on the walk; so is
		// anywhere down a stop too tall for the window, at the walk's zoom.
		const tall = boardRectOf(stops[index]).h * s > view.h - inset;
		const off = Math.hypot(x - camX, tall ? 0 : y - camY);
		wandering = Math.abs(s - scale) / s > 0.06 || off > 0.06 * view.w;
	}

	// The stop that fills most of the window, or none if none fills much of it.
	function nearestStop() {
		let best = -1;
		let most = 0.35;
		stops.forEach((element, index) => {
			const box = boardRectOf(element);
			const left = Math.max(0, camX + box.x * scale);
			const right = Math.min(view.w, camX + (box.x + box.w) * scale);
			const upper = Math.max(0, camY + box.y * scale);
			const lower = Math.min(view.h - inset, camY + (box.y + box.h) * scale);
			if (right <= left || lower <= upper) return;
			const seen = (right - left) * (lower - upper);
			const share = seen / Math.min(view.w * (view.h - inset), box.w * box.h * scale * scale);
			if (share > most) {
				most = share;
				best = index;
			}
		});
		return best;
	}

	export function next() {
		goTo(stop + 1);
	}

	export function previous() {
		goTo(stop - 1);
	}

	// Back to the stop the walk is at, from wherever you have wandered to.
	export function resume() {
		goTo(stop);
	}

	// All of the board, in the window above the caption, clear of its edges.
	export function overview() {
		const margin = 2 * rem();
		const room = { w: view.w - margin * 2, h: view.h - inset - margin * 2 };
		const s = clampScale(Math.min(room.w / board.w, room.h / board.h));
		flyTo(margin + (room.w - board.w * s) / 2, margin + (room.h - board.h * s) / 2, s, 900);
		wandering = true;
	}

	export function zoomIn() {
		zoomBy(1.25);
	}

	export function zoomOut() {
		zoomBy(1 / 1.25);
	}

	// Tabbing to something on another stop walks on to it; within a stop, it
	// is brought into view by the shortest way.
	function bringIntoView(element) {
		const index = stops.findIndex((item) => item.contains(element));
		if (index !== -1 && (index !== stop || wandering) && !inView(stops[index])) {
			goTo(index);
			return;
		}
		const box = boardRectOf(element);
		const margin = 2 * rem();
		const left = camX + box.x * scale;
		const right = left + box.w * scale;
		const upper = camY + box.y * scale;
		const lower = upper + box.h * scale;
		const bottom = view.h - inset;
		let dx = 0;
		let dy = 0;
		if (right - left > view.w - margin * 2 || left < margin) dx = margin - left;
		else if (right > view.w - margin) dx = view.w - margin - right;
		if (lower - upper > bottom - margin * 2 || upper < margin) dy = margin - upper;
		else if (lower > bottom - margin) dy = bottom - margin - lower;
		if (dx || dy) flyTo(camX + dx, camY + dy, scale, 380);
	}

	function inView(element) {
		const box = boardRectOf(element);
		const left = camX + box.x * scale;
		const upper = camY + box.y * scale;
		return (
			left >= -1 &&
			upper >= -1 &&
			left + box.w * scale <= view.w + 1 &&
			upper + box.h * scale <= view.h - inset + 1
		);
	}

	/* ---- Hands on the board ------------------------------------------- */

	function onpointerdown(event) {
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		stopMotion();
		suppressClick = false;
		pointers.set(event.pointerId, local(event));
		if (pointers.size === 1) {
			const [x, y] = local(event);
			gesture = { x, y, camX, camY, panning: false, lastX: x, lastY: y, lastT: event.timeStamp };
			gesture.vx = 0;
			gesture.vy = 0;
		} else if (pointers.size === 2) {
			startPinch();
		}
	}

	function startPinch() {
		const [a, b] = [...pointers.values()];
		pinch = {
			distance: Math.hypot(a[0] - b[0], a[1] - b[1]) || 1,
			midX: (a[0] + b[0]) / 2,
			midY: (a[1] + b[1]) / 2,
			camX,
			camY,
			scale
		};
		gesture = null;
		dragging = true;
		wandering = true;
	}

	function onpointermove(event) {
		if (!pointers.has(event.pointerId)) return;
		const [x, y] = local(event);
		pointers.set(event.pointerId, [x, y]);

		if (pinch && pointers.size >= 2) {
			const [a, b] = [...pointers.values()];
			const s = clampScale((pinch.scale * Math.hypot(a[0] - b[0], a[1] - b[1])) / pinch.distance);
			const k = s / pinch.scale;
			const midX = (a[0] + b[0]) / 2;
			const midY = (a[1] + b[1]) / 2;
			setCamera(midX - (pinch.midX - pinch.camX) * k, midY - (pinch.midY - pinch.camY) * k, s);
			return;
		}

		if (!gesture) return;
		if (!gesture.panning) {
			// A few pixels of slack, so a click with a shaky hand is still a click.
			if (Math.hypot(x - gesture.x, y - gesture.y) < 5) return;
			gesture.panning = true;
			dragging = true;
			wandering = true;
			viewport.setPointerCapture(event.pointerId);
		}
		const dt = Math.max(1, event.timeStamp - gesture.lastT);
		gesture.vx = ((x - gesture.lastX) / dt) * 16;
		gesture.vy = ((y - gesture.lastY) / dt) * 16;
		gesture.lastX = x;
		gesture.lastY = y;
		gesture.lastT = event.timeStamp;
		setCamera(gesture.camX + x - gesture.x, gesture.camY + y - gesture.y);
	}

	function onpointerup(event) {
		if (!pointers.has(event.pointerId)) return;
		pointers.delete(event.pointerId);

		if (pinch) {
			suppressClick = true;
			if (pointers.size < 2) pinch = null;
			if (pointers.size === 1) {
				// The finger still down carries on panning from here.
				const [[x, y]] = [...pointers.values()];
				gesture = { x, y, camX, camY, panning: true, lastX: x, lastY: y, lastT: event.timeStamp };
				gesture.vx = 0;
				gesture.vy = 0;
			} else {
				dragging = false;
				settle();
			}
			return;
		}

		if (!gesture) return;
		if (gesture.panning) {
			suppressClick = true;
			dragging = false;
			const fresh = event.type === 'pointerup' && event.timeStamp - gesture.lastT < 90;
			if (fresh) glide(gesture.vx, gesture.vy);
			else settle();
		}
		gesture = null;
	}

	// A drag that ends on a card is not a click on it.
	function onclickcapture(event) {
		if (!suppressClick) return;
		suppressClick = false;
		event.preventDefault();
		event.stopPropagation();
	}

	/* Every way of moving the board, wired up in one place. Pointer events cover
	   mouse, pen and touch; the wheel covers scrolling and trackpad pinches. The
	   wheel has to be a non-passive listener to stop the page itself scrolling. */
	function gestures(node) {
		// Wheels and trackpads send a stream of small moves; it has ended when
		// none has come for a moment.
		let resting = 0;
		const restSoon = () => {
			clearTimeout(resting);
			resting = setTimeout(settle, 220);
		};

		function onwheel(event) {
			event.preventDefault();
			stopMotion();
			wandering = true;
			restSoon();
			const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? view.h : 1;
			const dx = event.deltaX * unit;
			const dy = event.deltaY * unit;
			if (event.ctrlKey || event.metaKey) {
				// A trackpad pinch arrives as a wheel with ctrl held.
				// A mouse notch is a big delta and a pinch many small ones; cap each
				// step so one notch is a nudge, not a leap.
				const [x, y] = local(event);
				const step = Math.max(-24, Math.min(24, dy));
				zoomAt(x, y, scale * Math.exp(-step * 0.01));
			} else if (event.shiftKey && !dx) {
				setCamera(camX - dy, camY);
			} else {
				setCamera(camX - dx, camY - dy);
			}
		}

		// Safari reports a trackpad pinch as its own gesture events instead.
		let gestureScale = 1;
		function ongesturestart(event) {
			event.preventDefault();
			gestureScale = scale;
		}
		function ongesturechange(event) {
			event.preventDefault();
			wandering = true;
			restSoon();
			const [x, y] = local(event);
			zoomAt(x, y, gestureScale * event.scale);
		}

		function ondragstart(event) {
			event.preventDefault();
		}

		const listeners = [
			['pointerdown', onpointerdown],
			['pointermove', onpointermove],
			['pointerup', onpointerup],
			['pointercancel', onpointerup],
			['click', onclickcapture, { capture: true }],
			['dragstart', ondragstart],
			['wheel', onwheel, { passive: false }],
			['gesturestart', ongesturestart],
			['gesturechange', ongesturechange]
		];
		for (const [type, listener, options] of listeners) {
			node.addEventListener(type, listener, options);
		}
		return () => {
			clearTimeout(resting);
			for (const [type, listener, options] of listeners) {
				node.removeEventListener(type, listener, options);
			}
		};
	}

	/* The walk is Space and Page Down onwards, Shift-Space and Page Up back,
	   Home and End to either end. The arrows pan, as on any board. */
	function onkeydown(event) {
		if (!ready || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
		const target = event.target;
		if (target.closest?.('input, textarea, select, [contenteditable], dialog')) return;
		// Space on a button or a link presses it.
		if (event.key === ' ' && target.closest?.('a, button, summary, [role="button"]')) return;
		const step = 140;
		const pan = (dx, dy) => {
			wandering = true;
			flyTo(camX + dx, camY + dy, scale, 220, settle);
		};
		switch (event.key) {
			case ' ':
				if (event.shiftKey) previous();
				else next();
				break;
			case 'PageDown':
				next();
				break;
			case 'PageUp':
				previous();
				break;
			case 'Home':
				goTo(0);
				break;
			case 'End':
				goTo(stops.length - 1);
				break;
			case 'ArrowLeft':
				pan(step, 0);
				break;
			case 'ArrowRight':
				pan(-step, 0);
				break;
			case 'ArrowUp':
				pan(0, step);
				break;
			case 'ArrowDown':
				pan(0, -step);
				break;
			case '+':
			case '=':
				zoomIn();
				break;
			case '-':
			case '_':
				zoomOut();
				break;
			case '0':
			case 'Escape':
				if (!wandering) return;
				resume();
				break;
			default:
				return;
		}
		event.preventDefault();
	}

	function onfocusin(event) {
		if (!event.target.matches?.(':focus-visible')) return;
		bringIntoView(event.target.closest('[data-tile], article') ?? event.target);
	}

	// The stop the walk is at is marked, so the board around it can step back.
	$effect(() => {
		const here = wandering ? -1 : stop;
		if (!ready) return;
		stops.forEach((element, index) => element.toggleAttribute('data-here', index === here));
	});

	// The caption changing size changes the room a stop has, so frame it again.
	$effect(() => {
		const clear = inset;
		untrack(() => {
			if (!ready || wandering || frame || !stops[stop]) return;
			if (clear >= 0) setCamera(...frameOf(stops[stop]));
		});
	});

	onMount(() => {
		stops = [...world.querySelectorAll('[data-stop]')];
		count = stops.length;

		// The board starts where the nav ends, so the nav stays where it always is.
		const nav = document.querySelector('#layout-wrapper > nav');
		const measure = () => {
			top = nav ? Math.round(nav.getBoundingClientRect().bottom + window.scrollY) : 0;
			view = { w: viewport.clientWidth, h: viewport.clientHeight };
			board = { w: world.offsetWidth, h: world.offsetHeight };
		};

		// A new window size re-frames the stop, unless you have wandered off it.
		const observer = new ResizeObserver(() => {
			measure();
			if (!ready || !wandering) {
				stopMotion();
				const target = stops[stop];
				if (target) setCamera(...frameOf(target));
				ready = true;
			} else {
				setCamera(camX, camY, clampScale(scale));
			}
		});
		observer.observe(viewport);
		observer.observe(world);
		if (nav) observer.observe(nav);

		return () => {
			observer.disconnect();
			stopMotion();
		};
	});
</script>

<svelte:window {onkeydown} />

<div
	bind:this={viewport}
	class="canvas"
	class:dragging
	class:ready
	class:walking={!wandering}
	role="region"
	aria-label={label}
	aria-roledescription="canvas"
	style:top={`${top}px`}
	style:--inset={`${inset}px`}
	{onfocusin}
	{@attach gestures}
>
	<div
		bind:this={world}
		class="world"
		style:transform={`translate3d(${camX}px, ${camY}px, 0) scale(${scale})`}
	>
		{@render children()}
	</div>
</div>

<style>
	/* The window onto the board: everything under the nav, on the page's own ground. */
	.canvas {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: clip;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
		cursor: grab;
		/* The board slips under the nav's edge rather than being cut by it. */
		mask-image: linear-gradient(to bottom, transparent, #000 1.5rem);
		-webkit-mask-image: linear-gradient(to bottom, transparent, #000 1.5rem);
	}

	/* On the walk, the board ends where the caption begins, so the stops
	   beyond the one you are at don't peek out around it. */
	.canvas.walking {
		--veil: linear-gradient(
			to bottom,
			transparent,
			#000 1.5rem,
			#000 calc(100% - var(--inset)),
			transparent calc(100% - var(--inset) + 2rem)
		);
		mask-image: var(--veil);
		-webkit-mask-image: var(--veil);
	}

	.canvas.dragging {
		cursor: grabbing;
	}

	.canvas.dragging :global(*) {
		cursor: grabbing !important;
	}

	.world {
		position: absolute;
		top: 0;
		left: 0;
		width: max-content;
		transform-origin: 0 0;
		opacity: 0;
		transition: opacity 400ms ease;
	}

	.ready .world {
		opacity: 1;
	}

	/* Only while it moves: kept on, it would leave zoomed text soft. */
	.dragging .world {
		will-change: transform;
	}

	/* On the walk, the stop you are at is the board; the rest waits back. */
	.world :global([data-stop]) {
		transition: opacity 500ms ease;
	}

	.walking .world :global([data-stop]:not([data-here])) {
		opacity: 0.14;
	}

	@media (prefers-reduced-motion: reduce) {
		.world,
		.world :global([data-stop]) {
			transition: none;
		}
	}
</style>
