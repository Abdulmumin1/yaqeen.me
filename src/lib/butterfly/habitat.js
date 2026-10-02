// Where butterflies meet a page.
//
// A habitat is a patch of page (the "ground": any positioned element) with
// places to sit on it and one or more butterflies living there. This file is
// their behaviour: where they sit, what the cursor does to them, when they get
// restless, how they keep up with a reader who scrolls. How one flies is in
// flight.js and how it is drawn is in monarch.js.
//
// Places to sit are elements matching the habitat's `perches` selector:
//  - with no data-perch (or an empty one) the butterfly sits just past the
//    element's last word, like a full stop that got up and walked;
//  - data-perch="86% 14%" seats it on that point of the element's box instead
//    (on top of a word, on a flower in a picture);
//  - several points, comma separated, are several seats on one element;
//  - data-perch-live marks a perch that moves (a flower on a swaying stem):
//    whoever sits there is kept on it, and the element is told when something
//    lands on it or leaves, with butterfly:land and butterfly:leave events.

import { createFlight } from './flight.js';
import { createMonarch, SHADOW_DRIFT, SOURCE_WIDTH } from './monarch.js';

const WARY = 110; // px beyond bolting distance at which one starts to mind the cursor
const CROWDED = 120; // none will land this close to the cursor
const SHAKEN_OFF = 420; // px/s: carry one faster than this and it lets go

const between = (low, high) => low + Math.random() * (high - low);
const clamp = (value, low, high) => Math.min(Math.max(value, low), high);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const lean = () => between(-0.5, 0.22);

// ------------------------------------------------------------ the picture

let atlas = null;

/** The picture every butterfly is cut from. Loaded once, however many ask. */
export function loadAtlas() {
	if (!atlas) {
		const image = new Image();
		image.src = '/butterfly/monarch-atlas.webp';
		atlas = image.decode().then(() => image);
		atlas.catch(() => (atlas = null));
	}
	return atlas;
}

// ------------------------------------------------------------- the cursor

// Where the reader's cursor is in the window and its velocity in px/s. One
// listener serves every habitat on the page.
let cursor = null;
const watching = new Set();

function cursorMoved(event) {
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
	for (const reactions of watching) reactions.moved();
}

function cursorLeft() {
	cursor = null;
	for (const reactions of watching) reactions.left();
}

function watchCursor(reactions) {
	if (!watching.size) {
		window.addEventListener('pointermove', cursorMoved, { passive: true });
		document.documentElement.addEventListener('pointerleave', cursorLeft);
	}
	watching.add(reactions);
	return () => {
		watching.delete(reactions);
		if (watching.size) return;
		window.removeEventListener('pointermove', cursorMoved);
		document.documentElement.removeEventListener('pointerleave', cursorLeft);
		cursor = null;
	};
}

const cursorPace = () =>
	cursor && performance.now() - cursor.at < 90 ? Math.hypot(cursor.vx, cursor.vy) : 0;

// ---------------------------------------------------------- places to sit

/**
 * @typedef {Object} Perch
 * @property {Element} element
 * @property {[number, number] | null} at - A point of the element's box (fractions), or null for "past the last word".
 * @property {boolean} live - Whether it moves about, so that a sitter has to be kept on it.
 * @property {string} key  - Tells it from every other perch, however the page changes round it.
 */

const names = new WeakMap();
let named = 0;
const nameOf = (element) => names.get(element) ?? names.set(element, (named += 1)).get(element);

/** @returns {Perch[]} */
export function perchesIn(ground, selector) {
	const perches = [];
	for (const element of ground.querySelectorAll(selector)) {
		if (!element.getClientRects().length) continue; // not on the page at this size
		const points = (element.dataset.perch ?? '')
			.split(',')
			.map((point) => point.trim().split(/\s+/).map(parseFloat))
			.filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
		const live = element.hasAttribute('data-perch-live');
		const name = nameOf(element);
		if (!points.length) perches.push({ element, at: null, live, key: `${name}` });
		points.forEach(([x, y], n) =>
			perches.push({ element, at: [x / 100, y / 100], live, key: `${name}.${n}` })
		);
	}
	return perches;
}

/**
 * A perch as a spot in the ground's coordinates.
 *
 * @param {Perch} perch
 * @param {Element} ground
 * @param {number} tilt - How the butterfly leans there, radians clockwise.
 * @param {number} [gap] - How far past the last word it sits.
 */
export function spotOn(perch, ground, tilt, gap = 27) {
	const origin = ground.getBoundingClientRect();
	if (perch.at) {
		const box = perch.element.getBoundingClientRect();
		return {
			x: box.left + box.width * perch.at[0] - origin.left,
			y: box.top + box.height * perch.at[1] - origin.top,
			tilt
		};
	}
	// Measure the words, not the full-width box they sit in.
	const words = document.createRange();
	words.selectNodeContents(perch.element);
	const text = words.getBoundingClientRect();
	return {
		x: text.right - origin.left + gap,
		y: text.top - origin.top + Math.min(5, text.height * 0.25),
		tilt
	};
}

/** The part of the ground the reader can see, in the ground's coordinates. */
export function viewOf(ground) {
	const origin = ground.getBoundingClientRect();
	return {
		left: -origin.left,
		top: -origin.top,
		right: -origin.left + document.documentElement.clientWidth,
		bottom: -origin.top + window.innerHeight
	};
}

/** Whether a spot is comfortably inside what viewOf() returned. */
export const within = (spot, seen) =>
	spot.y > seen.top + 24 && spot.y < seen.bottom - 24 && spot.x > seen.left && spot.x < seen.right;

// ---------------------------------------------------------------- the sky

/** The box the page scrolls in: the nearest ancestor that clips, or the document. */
function pageOf(element) {
	for (let up = element.parentElement; up && up !== document.body; up = up.parentElement) {
		if (getComputedStyle(up).overflowY !== 'visible') return up;
	}
	return document.documentElement;
}

/**
 * A butterfly is drawn on a canvas that follows it about, and a canvas that
 * pokes out past the end of the page makes the page longer: scrollbars come
 * and go and the page shifts under the reader. So the canvases live in a
 * "sky", a box laid exactly over the page that clips whatever leaves it.
 *
 * This keeps that box in place. `sky` is absolutely positioned in `ground`
 * and takes its insets from the --sky-* properties set here; whatever is in
 * it should sit in a child placed at (--sky-left, --sky-up), which is the
 * ground's own top left corner.
 *
 * @returns {() => void} Call to stop.
 */
export function frameSky(sky, ground) {
	const page = pageOf(ground);
	const frame = () => {
		const inner = ground.getBoundingClientRect();
		const outer = page.getBoundingClientRect();
		const set = (name, value) => sky.style.setProperty(name, `${Math.max(value, 0).toFixed(1)}px`);
		set('--sky-up', inner.top - outer.top);
		set('--sky-left', inner.left - outer.left);
		set('--sky-right', outer.right - inner.right);
		// A pixel short, so that rounding can never push it over the edge.
		set('--sky-below', outer.bottom - inner.bottom - 1);
	};
	const watcher = new ResizeObserver(frame);
	watcher.observe(page);
	watcher.observe(ground);
	frame();
	return () => watcher.disconnect();
}

// -------------------------------------------------------------- a habitat

/**
 * @typedef {Object} Butterfly
 * @property {HTMLCanvasElement} canvas   - What it is drawn on: `stage` px square, anchored at the ground's top left.
 * @property {HTMLCanvasElement} [shadow] - The same for its shadow, if it is to have one.
 * @property {number} span                - px across the whole photo while it sits.
 *
 * @typedef {Object} HabitatOptions
 * @property {HTMLElement} ground
 * @property {HTMLImageElement} atlas     - From loadAtlas().
 * @property {Butterfly[]} butterflies
 * @property {string} [perches]           - Selector, within the ground, for the things they sit on.
 * @property {number} [stage]             - px square each is drawn in.
 * @property {[number, number]} [restless] - Seconds one sits before wandering off unprompted.
 * @property {number} [pace]              - How briskly they fly; 1 is a monarch in no hurry.
 * @property {boolean} [courts]           - Whether one may come and sit on a cursor left lying still.
 * @property {boolean} [arrives]          - Whether the first flies in, rather than being found sitting.
 * @property {boolean} [greets]           - Whether they stir soon after the reader scrolls them into sight.
 * @property {'page' | 'ground'} [roams]  - Free to cross whatever the reader can see, or kept over the ground.
 * @property {(index: number, spot: {x: number, y: number}) => void} [onSettle] - One has landed on a perch.
 * @property {() => void} [onShow]        - Something has been drawn.
 */

/**
 * Bring a patch of page to life. Returns null if there is nothing to draw
 * butterflies with (no WebGL).
 *
 * @param {HabitatOptions} options
 */
export function createHabitat({
	ground,
	atlas,
	butterflies,
	perches = '[data-perch]',
	stage = 144,
	restless = [22, 55],
	pace = 1,
	courts = false,
	arrives = false,
	greets = false,
	roams = 'page',
	onSettle,
	onShow
}) {
	const monarch = createMonarch(atlas, () => residents.forEach(draw));
	if (!monarch) return null;

	const residents = butterflies.map((given, index) => ({
		index,
		canvas: given.canvas,
		pen: given.canvas.getContext('2d'),
		shadow: given.shadow ?? null,
		ink: given.shadow?.getContext('2d') ?? null,
		scale: given.span / SOURCE_WIDTH,
		gap: given.span * 0.61,
		flight: createFlight({ pace }),
		here: null, // the key of the perch it is on, or making for
		seat: null, // the perch it is sitting on, once it has landed
		living: false,
		courting: false, // on its way to the reader's cursor
		riding: false, // sitting on it
		rested: false,
		blur: -1,
		checked: 0,
		restless: 0,
		calm: 0
	}));

	const tidy = [];
	const listen = (target, type, handler, options) => {
		target.addEventListener(type, handler, options);
		tidy.push(() => target.removeEventListener(type, handler, options));
	};
	let stopped = false;
	let frame = 0;
	let last = 0;
	let asleepSince = 0;
	let stir = 0;
	let follow = 0;
	let seenLately = false;

	const view = () => viewOf(ground);
	// Which perches there are changes seldom (a flower opens, a row wraps), so the
	// list is kept for a moment; where each one is, is measured fresh every time.
	let known = { at: -Infinity, list: [] };
	const places = () => {
		const now = performance.now();
		if (now - known.at > 250) known = { at: now, list: perchesIn(ground, perches) };
		return known.list;
	};
	const perchOf = (resident, all = places()) =>
		all.find((perch) => perch.key === resident.here) ?? null;
	const taken = (key, by) =>
		residents.some((other) => other !== by && other.living && other.here === key);
	const mouse = () => {
		if (!cursor) return null;
		const origin = ground.getBoundingClientRect();
		return { x: cursor.x - origin.left, y: cursor.y - origin.top };
	};

	/** Where they may wander: all the reader can see, or only what of that is over the ground. */
	function airspace() {
		const seen = view();
		if (roams === 'page') return seen;
		const all = { left: 0, right: ground.offsetWidth, top: 0, bottom: ground.offsetHeight };
		const air = {
			left: Math.max(seen.left, all.left),
			right: Math.min(seen.right, all.right),
			top: Math.max(seen.top, all.top),
			bottom: Math.min(seen.bottom, all.bottom)
		};
		// With too little of the ground in sight to fly in, they have the whole of it.
		return air.bottom - air.top < 120 || air.right - air.left < 120 ? all : air;
	}

	/** Another place for one to sit: free, in sight and away from the cursor if it can be. */
	function elsewhere(resident) {
		const seen = view();
		const pointer = mouse();
		const options = places()
			.filter((perch) => perch.key !== resident.here && !taken(perch.key, resident))
			.map((perch) => ({ key: perch.key, spot: spotOn(perch, ground, lean(), resident.gap) }));
		if (!options.length) return null;
		const clear = (option) =>
			!pointer || Math.hypot(option.spot.x - pointer.x, option.spot.y - pointer.y) > CROWDED;
		const best = [
			options.filter((option) => within(option.spot, seen) && clear(option)),
			options.filter((option) => within(option.spot, seen)),
			options.filter(clear)
		].find((list) => list.length);
		return pick(best ?? options);
	}

	/** Back where it is (or was), facing another way, for when there is nowhere else. */
	function sameSpot(resident) {
		const perch = perchOf(resident);
		return perch ? spotOn(perch, ground, lean(), resident.gap) : null;
	}

	/**
	 * Somewhere to wander past on the way from one spot to another: off to one
	 * side of the straight line, wherever there is room and no cursor.
	 */
	function detour(from, to) {
		const air = airspace();
		const pointer = mouse();
		const roomy = air.bottom - air.top > 320;
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
						air.left + 50,
						Math.max(air.left + 50, air.right - 50)
					),
					y: roomy
						? clamp(
								from.y + (to.y - from.y) * along + between(-120, 60),
								air.top + 70,
								air.bottom - 70
							)
						: between(air.top + 30, Math.max(air.top + 30, air.bottom - 60))
				};
				if (pointer && Math.hypot(point.x - pointer.x, point.y - pointer.y) < 170) continue;
				points.push(point);
				break;
			}
		}
		return points;
	}

	function fit() {
		const density = window.devicePixelRatio || 1;
		// Drawn larger than shown, so the pattern stays as crisp as the photo.
		const sharp = density * (density >= 3 ? 1.34 : 2);
		monarch.resize(stage, sharp);
		for (const resident of residents) {
			const pixels = Math.round(stage * sharp);
			if (resident.canvas.width !== pixels) resident.canvas.width = resident.canvas.height = pixels;
			const soft = Math.round(stage * Math.min(density, 2));
			if (resident.shadow && resident.shadow.width !== soft) {
				resident.shadow.width = resident.shadow.height = soft;
			}
		}
	}

	/** Move its picture to where it is now, without drawing it again. */
	function place(resident, pose = resident.flight.pose()) {
		const x = (pose.x - stage / 2).toFixed(2);
		const y = (pose.y - stage / 2).toFixed(2);
		resident.canvas.style.transform = `translate3d(${x}px, ${y}px, 0)`;
	}

	function draw(resident) {
		if (!resident.living) return;
		const pose = resident.flight.pose();
		const half = stage / 2;
		if (resident.ink) {
			// Its shadow slides out from under it as it leaves the page, and softens.
			monarch.drawShadow(resident.ink, pose, resident.scale);
			const off = pose.height;
			const x = pose.x + 1 + SHADOW_DRIFT[0] * off - half;
			const y = pose.y + 2 + SHADOW_DRIFT[1] * off - half;
			resident.shadow.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
			resident.shadow.style.opacity = (0.25 / (1 + off / 60)).toFixed(3);
			const soft = Math.round((1 + off * 0.07) * 2) / 2;
			if (soft !== resident.blur) {
				resident.blur = soft;
				resident.shadow.style.filter = `blur(${soft}px)`;
			}
		}
		monarch.draw(resident.pen, { ...pose, scale: resident.scale * pose.zoom });
		place(resident, pose);
		onShow?.();
	}

	/** It has sat down on a perch, or got up off one: note it, and let the perch know. */
	function sitOn(resident, perch) {
		if (resident.seat === perch) return;
		resident.seat?.element.dispatchEvent(new CustomEvent('butterfly:leave'));
		resident.seat = perch ?? null;
		perch?.element.dispatchEvent(new CustomEvent('butterfly:land'));
	}

	/** On the tip of the cursor, like the end of a twig. */
	function onCursor() {
		const pointer = mouse();
		return pointer && { x: pointer.x + 1, y: pointer.y - 9 };
	}

	function tick(now) {
		frame = 0;
		if (stopped) return;
		const elapsed = Math.min((now - last) / 1000, 0.05);
		last = now;
		const air = airspace();
		const bounds = { left: air.left + 6, right: air.right - 6 };
		if (roams === 'ground') Object.assign(bounds, { top: air.top - 30, bottom: air.bottom - 26 });
		const pointer = mouse();
		const all = places();
		const seen = view();
		let busy = false;

		for (const resident of residents) {
			if (!resident.living) continue;
			const { flight } = resident;
			const was = flight.mode;

			if (resident.courting) {
				// It only wants the cursor while the cursor keeps (nearly) still.
				const spot = onCursor();
				if (spot && cursorPace() < 260) {
					flight.follow({ ...spot, tilt: flight.target.tilt });
				} else {
					resident.courting = false;
					moveOn(resident);
				}
			} else if (flight.mode === 'flying' && now - resident.checked > 350) {
				// Is someone hovering over the place it is making for? Pick another.
				resident.checked = now;
				const target = flight.target;
				if (pointer && Math.hypot(target.x - pointer.x, target.y - pointer.y) < CROWDED) {
					const other = elsewhere(resident);
					if (other) {
						resident.here = other.key;
						flight.retarget(other.spot);
					}
				}
			}

			// A perch that moves (a flower in the wind) takes whoever is on it, or
			// making for it, along with it. One that has gone (the page is another
			// shape now) is no longer anywhere to be.
			const free = resident.courting || resident.riding;
			const perch = free ? null : perchOf(resident, all);
			if (!free && !perch && resident.here !== null) abandon(resident);
			const swaying = Boolean(perch?.live);
			if (swaying) {
				const spot = spotOn(perch, ground, flight.target.tilt, resident.gap);
				if (flight.mode === 'perched') flight.perch({ x: spot.x, y: spot.y });
				else if (flight.mode !== 'windup') flight.follow(spot);
			}

			flight.step(elapsed, { pointer: resident.courting ? null : pointer, bounds });
			if (was !== 'perched' && flight.mode === 'perched') landed(resident);

			if (!flight.still || !resident.rested) draw(resident);
			else if (swaying) place(resident);
			resident.rested = flight.still;
			// One sitting still on something that sways still has to be moved with
			// it, though only while there is anyone to see.
			const carried = swaying && flight.mode === 'perched' && within(flight.target, seen);
			if (!flight.still || carried) busy = true;
		}

		if (busy) frame = requestAnimationFrame(tick);
		else nap();
	}

	function wake() {
		clearTimeout(stir);
		stir = 0;
		if (frame || stopped || document.hidden) return;
		if (asleepSince) {
			const dozed = (performance.now() - asleepSince) / 1000;
			for (const resident of residents) resident.flight.doze(dozed);
		}
		asleepSince = 0;
		last = performance.now();
		frame = requestAnimationFrame(tick);
	}

	const inSight = () => {
		const seen = view();
		return residents.some((resident) => resident.living && within(resident.flight.target, seen));
	};

	/** Nothing is moving: stop drawing until one of them next stirs. */
	function nap() {
		asleepSince ||= performance.now();
		clearTimeout(stir);
		stir = 0;
		// No point fanning wings where nobody can see: scrolling back wakes them.
		if (!inSight()) return;
		const soonest = Math.min(
			...residents.filter((resident) => resident.living).map((resident) => resident.flight.nextStir)
		);
		stir = setTimeout(wake, Math.max(soonest, 0.2) * 1000);
	}

	const restlessIn = (resident, [low, high] = restless) => {
		clearTimeout(resident.restless);
		resident.restless = setTimeout(() => wanderOff(resident), between(low, high) * 1000);
	};

	function landed(resident) {
		if (resident.courting) {
			resident.courting = false;
			resident.riding = true;
			resident.here = null;
			restlessIn(resident, [12, 26]);
			return;
		}
		sitOn(resident, perchOf(resident));
		onSettle?.(resident.index, resident.flight.target);
		restlessIn(resident);
	}

	/** Already in the air, and wherever it was going will not do: go somewhere else instead. */
	function moveOn(resident) {
		const other = elsewhere(resident);
		const spot = other?.spot ?? sameSpot(resident);
		if (other) resident.here = other.key;
		if (spot) resident.flight.retarget(spot);
	}

	/** Its perch is not there any more: get off it, or stop making for it. */
	function abandon(resident) {
		const { mode } = resident.flight;
		resident.here = null;
		if (mode === 'perched') leave(resident);
		else if (mode !== 'windup') moveOn(resident);
	}

	/** Off to another perch: scared by something at `from`, or (without) in its own time. */
	function leave(resident, from = null) {
		const { flight } = resident;
		if (flight.mode !== 'perched') return;
		const next = elsewhere(resident);
		const spot = next?.spot ?? sameSpot(resident);
		if (!spot) return;
		clearTimeout(resident.restless);
		resident.riding = false;
		sitOn(resident, null);
		flight.flyTo(spot, from, detour(flight.target, spot));
		if (next) resident.here = next.key;
		wake();
	}

	/** Up, round and back down where it was, facing another way. */
	function hop(resident) {
		const spot = sameSpot(resident);
		if (!spot) return leave(resident);
		const air = airspace();
		const side = Math.random() < 0.5 ? -1 : 1;
		const out = {
			x: clamp(spot.x + side * between(110, 200), air.left + 40, air.right - 40),
			y: Math.max(spot.y - between(60, 150), air.top + 20)
		};
		sitOn(resident, null);
		resident.flight.flyTo(spot, null, [out]);
		wake();
	}

	/** The cursor has not moved in a while. It will do to sit on. */
	function court(resident) {
		const spot = onCursor();
		if (!spot) return leave(resident);
		resident.courting = true;
		sitOn(resident, null);
		const { flight } = resident;
		flight.flyTo({ ...spot, tilt: between(-0.3, 0.1) }, null, detour(flight.target, spot));
		wake();
	}

	function wanderOff(resident) {
		const { flight } = resident;
		if (flight.mode !== 'perched' || document.hidden || !within(flight.target, view())) {
			restlessIn(resident, [8, 16]);
			return;
		}
		const idle = cursor && performance.now() - cursor.at > 2500;
		const spoken = residents.some((other) => other.courting || other.riding);
		if (courts && !resident.riding && !spoken && idle && Math.random() < 0.55) court(resident);
		else if (!resident.riding && Math.random() < 0.4) hop(resident);
		else leave(resident);
	}

	/** The reader has scrolled it out of sight: come and find them. */
	function catchUp(resident) {
		const { flight } = resident;
		if (flight.mode !== 'perched' || resident.riding || document.hidden) return;
		const seen = view();
		if (within(flight.target, seen)) return;
		const near = places()
			.map((perch) => ({ key: perch.key, spot: spotOn(perch, ground, lean(), resident.gap) }))
			.filter((option) => within(option.spot, seen) && !taken(option.key, resident));
		if (!near.length) return;
		const next = pick(near);
		// It comes in over whichever edge it was left behind.
		const above = flight.target.y < seen.top;
		const from = {
			x: clamp(next.spot.x + between(-260, 260), seen.left + 20, seen.right - 20),
			y: above ? seen.top - 30 : seen.bottom + 30
		};
		resident.here = next.key;
		clearTimeout(resident.restless);
		sitOn(resident, null);
		flight.arrive(from, next.spot);
		wake();
	}

	function relax(resident) {
		resident.flight.setWary(0);
		if (!resident.flight.still) wake();
	}

	/** Sitting on a perch with the cursor about: mind it, or go. */
	function notice(resident) {
		const { flight } = resident;
		const pointer = mouse();
		const dx = flight.target.x - pointer.x;
		const dy = flight.target.y - pointer.y;
		const reach = Math.hypot(dx, dy) || 1;
		// What frightens it is being closed in on. Come straight at it quickly and it is
		// gone before you are near; pass by, or creep up, and you can almost touch it.
		const closing = Math.max(0, (cursor.vx * dx + cursor.vy * dy) / reach);
		const bolt = clamp(26 + closing * 0.12, 26, 150);
		if (reach < bolt) return leave(resident, pointer);

		const wary = clamp(1 - (reach - bolt) / WARY, 0, 1);
		flight.setWary(wary * wary * (3 - 2 * wary));
		// It gets used to a cursor that just sits there.
		clearTimeout(resident.calm);
		if (wary > 0) resident.calm = setTimeout(() => relax(resident), 1600);
		if (!flight.still) wake();
	}

	/** Sitting on the cursor while it moves: hold on, or let go. */
	function carry(resident) {
		const spot = onCursor();
		const speed = cursorPace();
		if (!spot || speed > SHAKEN_OFF) return leave(resident, mouse());
		resident.flight.perch(spot);
		resident.flight.setWary(clamp(speed / SHAKEN_OFF, 0, 1));
		clearTimeout(resident.calm);
		resident.calm = setTimeout(() => relax(resident), 260);
		draw(resident);
		wake();
	}

	const sitting = () =>
		residents.filter((resident) => resident.living && resident.flight.mode === 'perched');

	tidy.push(
		watchCursor({
			moved() {
				for (const resident of sitting()) {
					if (resident.riding) carry(resident);
					else notice(resident);
				}
			},
			left() {
				for (const resident of sitting()) {
					if (resident.riding) leave(resident);
					else relax(resident);
				}
			}
		})
	);

	listen(
		window,
		'pointerdown',
		(event) => {
			const origin = ground.getBoundingClientRect();
			const point = { x: event.clientX - origin.left, y: event.clientY - origin.top };
			// A finger has no hover, so a tap anywhere near sends one off. A click
			// on one does too, and is a jolt to anything sitting on the cursor.
			const near = event.pointerType === 'touch' ? 64 : 26;
			for (const resident of sitting()) {
				const { target } = resident.flight;
				if (resident.riding || Math.hypot(point.x - target.x, point.y - target.y) < near) {
					leave(resident, point);
				}
			}
		},
		{ passive: true }
	);

	listen(
		window,
		'scroll',
		() => {
			for (const resident of sitting()) {
				// The page moved under the cursor; one sitting on the cursor stays with it.
				const spot = resident.riding && onCursor();
				if (!spot) continue;
				resident.flight.perch(spot);
				draw(resident);
			}
			// Scrolled back into sight: carry on fanning, and perhaps put on a show.
			const sighted = inSight();
			if (sighted && !frame && !stir) wake();
			if (sighted && !seenLately && greets) {
				sitting().forEach((resident, n) => restlessIn(resident, [3.2 + n * 1.6, 5 + n * 3]));
			}
			seenLately = sighted;
			clearTimeout(follow);
			follow = setTimeout(
				() => {
					residents.forEach((resident, n) => setTimeout(() => catchUp(resident), n * 420));
				},
				between(2200, 3800)
			);
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
		const seen = view();
		sitting()
			.filter((resident) => within(resident.flight.target, seen))
			.forEach((resident, n) => {
				const { target } = resident.flight;
				const under = { x: target.x + between(-20, 20), y: target.y + 40 };
				setTimeout(() => leave(resident, under), n * between(60, 160));
			});
	});
	lights.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

	/** The page has reflowed: keep each on its perch, or still making for it. */
	function stayPut() {
		fit();
		known.at = -Infinity; // the perches may not be what they were
		const all = places();
		for (const resident of residents) {
			if (!resident.living) continue;
			const { flight } = resident;
			const free = resident.riding || resident.courting;
			const perch = free ? null : perchOf(resident, all);
			if (perch) {
				const spot = spotOn(perch, ground, flight.target.tilt, resident.gap);
				if (flight.mode === 'perched') {
					flight.perch({ x: spot.x, y: spot.y });
					onSettle?.(resident.index, spot);
				} else if (flight.mode !== 'windup') {
					flight.follow(spot);
				}
			} else if (!free && resident.here !== null) {
				abandon(resident);
			}
			draw(resident);
		}
	}
	const watcher = new ResizeObserver(stayPut);
	watcher.observe(ground);
	// Zooming changes how many pixels they need without the page changing size.
	listen(window, 'resize', stayPut, { passive: true });

	tidy.push(() => {
		cancelAnimationFrame(frame);
		clearTimeout(stir);
		clearTimeout(follow);
		for (const resident of residents) {
			clearTimeout(resident.restless);
			clearTimeout(resident.calm);
		}
		watcher.disconnect();
		lights.disconnect();
		monarch.destroy();
	});

	// Begin. The first may fly in, if there is somewhere in sight to land; the
	// rest are found sitting, each on a perch of its own.
	fit();
	const seen = view();
	const free = [...places()];
	for (const resident of residents) {
		if (!free.length) break;
		const spots = free.map((perch) => spotOn(perch, ground, lean(), resident.gap));
		const flyIn = arrives && resident.index === 0;
		const inSightNow = spots.map((spot, n) => (within(spot, seen) ? n : -1)).filter((n) => n >= 0);
		const first = inSightNow[0] ?? -1;
		let choice = Math.floor(Math.random() * free.length);
		if (flyIn) choice = Math.max(first, 0);
		else if (inSightNow.length) choice = pick(inSightNow);
		const spot = spots[choice];
		const [perch] = free.splice(choice, 1);
		resident.here = perch.key;
		resident.living = true;
		if (flyIn && first >= 0) {
			const from = { x: Math.min(spot.x + between(260, 420), seen.right - 40), y: seen.top - 30 };
			resident.flight.arrive(from, spot);
		} else {
			resident.flight.perch(spot);
			sitOn(resident, perch);
			onSettle?.(resident.index, spot);
			draw(resident);
			restlessIn(resident, [restless[0] * 0.3, restless[1] * 0.6]);
		}
	}
	seenLately = inSight();
	wake();

	return {
		/**
		 * Send one on its way. With a point in the window (a click) it bolts from
		 * there; without, it leaves in its own time.
		 *
		 * @param {number} index
		 * @param {{clientX: number, clientY: number} | null} [from]
		 */
		shoo(index, from = null) {
			const resident = residents[index];
			if (!resident?.living) return;
			if (!from) return leave(resident);
			const origin = ground.getBoundingClientRect();
			leave(resident, { x: from.clientX - origin.left, y: from.clientY - origin.top });
		},

		destroy() {
			stopped = true;
			tidy.forEach((undo) => undo());
		}
	};
}
