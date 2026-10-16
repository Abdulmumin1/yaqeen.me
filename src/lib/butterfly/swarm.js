// A swarm: a few hundred monarchs sitting close together in the shape of some
// text, the way they hang in clusters off the trees they winter in. They fly in
// from every side to make it, scatter when the cursor comes through and settle
// back where they were, all lift off at a click or when the lights change, and
// a few will go and sit on a link that asks for them.
//
// There are far too many for the 3D model in monarch.js. Each one here is the
// same photo (see atlas.js) drawn flat on a single canvas, its wings beating by
// squeezing the picture in towards the body, which is what wings do when seen
// from above. The single monarch's manners are in habitat.js; these are its
// cousins, in a crowd.

import { ATLAS, AXIS, SOURCE } from './atlas.js';

const TAU = Math.PI * 2;
const THORAX = 470; // the middle of the thorax in the photo: what each one turns about
const SPREAD = 0.8; // how much of the photo's width a monarch's open wings fill
const WEIGHT = 800; // of the type the shape is cut from
const GAP = 7; // between letters, in px at a 100px size
const RESTLESS = 0.45; // a second, across the whole swarm: one gets up for a little flight
const SHAKEN_OFF = 300; // px/s: move faster than this with one on the cursor and it lets go
const COURTS_AFTER = 2.4; // s the cursor has to lie still before one comes and sits on it

const between = (low, high) => low + Math.random() * (high - low);
const clamp = (value, low, high) => Math.min(Math.max(value, low), high);
/** The shortest turn from one heading to another: -π to π. */
const turn = (from, to) => ((((to - from) % TAU) + TAU + Math.PI) % TAU) - Math.PI;

// ------------------------------------------------------------ the pictures

function sheet(width, height) {
	const canvas = document.createElement('canvas');
	canvas.width = Math.max(1, Math.round(width));
	canvas.height = Math.max(1, Math.round(height));
	const pen = canvas.getContext('2d');
	pen.imageSmoothingQuality = 'high';
	return { canvas, pen };
}

/** Part of an image at another size, shrunk by halves on the way so it stays crisp. */
function resample(image, [x, y, w, h], width, height) {
	let source = image;
	while (w / 2 >= width && h / 2 >= height) {
		const half = sheet(w / 2, h / 2);
		half.pen.drawImage(source, x, y, w, h, 0, 0, half.canvas.width, half.canvas.height);
		[source, x, y, w, h] = [half.canvas, 0, 0, half.canvas.width, half.canvas.height];
	}
	const out = sheet(width, height);
	out.pen.drawImage(source, x, y, w, h, 0, 0, out.canvas.width, out.canvas.height);
	return out.canvas;
}

/**
 * The monarch cut to size: `frame` px across the whole photo. The wings and the
 * body come apart, so that the wings can fold while the body stays as it is;
 * `whole` is the two together, for one sitting with its wings flat open.
 */
function cut(atlas, frame) {
	const k = frame / SOURCE.width;
	const height = Math.round(SOURCE.height * k);
	const { wings: w, body: b } = ATLAS;
	const wings = resample(atlas, [w.x, w.y, w.width, w.height], frame, height);
	const body = resample(atlas, [b.x, b.y, b.width, b.height], b.from.width * k, b.from.height * k);
	const bodyAt = { x: b.from.left * k, y: b.from.top * k };

	const whole = sheet(frame, height);
	whole.pen.drawImage(wings, 0, 0);
	whole.pen.drawImage(body, bodyAt.x, bodyAt.y);

	// Its shadow: the same shape in black, gone soft at the edges.
	const pad = Math.ceil(frame * 0.05) + 2;
	const flat = sheet(frame, height);
	flat.pen.drawImage(whole.canvas, 0, 0);
	flat.pen.globalCompositeOperation = 'source-in';
	flat.pen.fillRect(0, 0, frame, height);
	const shadow = sheet(frame + pad * 2, height + pad * 2);
	shadow.pen.shadowColor = '#000';
	shadow.pen.shadowBlur = Math.max(1, frame * 0.03);
	shadow.pen.drawImage(flat.canvas, pad, pad);

	return {
		frame,
		wings,
		body,
		bodyAt,
		whole: whole.canvas,
		shadow: shadow.canvas,
		pad,
		axis: { x: AXIS * k, y: THORAX * k }
	};
}

// --------------------------------------------------------------- the shape

/**
 * Where they sit to spell `text` in a box `width` by `height`: the letters set
 * as large as will fit, each at its own lean, and filled with points on a
 * jittered grid, a little in from the edges so the wings do not stick out much.
 */
function shape({ text, font, tilts, width, height, most }) {
	const probe = sheet(1, 1).pen;
	probe.font = `${WEIGHT} 100px ${font}`;
	const glyphs = [...text].map((char) => {
		const m = probe.measureText(char);
		return {
			char,
			left: m.actualBoundingBoxLeft,
			ink: m.actualBoundingBoxLeft + m.actualBoundingBoxRight
		};
	});
	const all = probe.measureText(text);
	const up = all.actualBoundingBoxAscent;
	const down = all.actualBoundingBoxDescent;
	const across = glyphs.reduce((sum, glyph) => sum + glyph.ink, 0) + GAP * (glyphs.length - 1);
	const scale = Math.min((width * 0.97) / across, (height * 0.84) / (up + down));
	const size = 100 * scale;
	const unit = clamp(size * 0.085, 14, 26); // px across the photo of one of them

	/** The letters, filled or outlined, onto a 2D context the size of the box. */
	const letters = (pen, outline = false) => {
		pen.font = `${WEIGHT} ${size}px ${font}`;
		let x = 0;
		glyphs.forEach((glyph, n) => {
			const w = glyph.ink * scale;
			pen.save();
			pen.translate(x + w / 2, height / 2);
			pen.rotate(tilts[n] ?? 0);
			const at = [-w / 2 + glyph.left * scale, ((up - down) / 2) * scale];
			if (outline) pen.strokeText(glyph.char, ...at);
			else pen.fillText(glyph.char, ...at);
			pen.restore();
			x += w + GAP * scale;
		});
	};

	const plate = sheet(width, height);
	letters(plate.pen);
	const { width: W, height: H } = plate.canvas;
	const ink = plate.pen.getImageData(0, 0, W, H).data;
	const solid = (x, y) =>
		x >= 0 && y >= 0 && x < W && y < H && ink[((y | 0) * W + (x | 0)) * 4 + 3] > 127;
	const inside = (x, y, r) =>
		solid(x, y) && solid(x + r, y) && solid(x - r, y) && solid(x, y + r) && solid(x, y - r);

	let step = unit * SPREAD * 0.6;
	let points = [];
	for (let attempt = 0; attempt < 4; attempt += 1) {
		points = [];
		for (let row = 0, y = step / 2; y < H; row += 1, y += step * 0.866) {
			for (let x = ((row % 2) * step) / 2; x < W; x += step) {
				const px = x + between(-0.2, 0.2) * step;
				const py = y + between(-0.2, 0.2) * step;
				if (inside(px, py, unit * 0.16)) points.push({ x: px, y: py });
			}
		}
		if (points.length <= most) break;
		step *= Math.sqrt(points.length / most) * 1.02;
	}

	/** A dashed outline of the letters, like a cut-out where they were. */
	const outline = (color, density) => {
		const { canvas, pen } = sheet(width * density, height * density);
		pen.scale(density, density);
		pen.strokeStyle = color;
		pen.lineWidth = 1.25;
		pen.lineCap = 'round';
		pen.setLineDash([2.5, 5]);
		letters(pen, true);
		return canvas;
	};

	return { points, unit, outline };
}

// --------------------------------------------------------------- the swarm

/**
 * @typedef {Object} SwarmOptions
 * @property {HTMLCanvasElement} canvas - Laid over the whole window: fixed, inset 0, never clicked.
 * @property {HTMLElement} stage        - The box the text is spelled out in.
 * @property {HTMLImageElement} atlas   - From loadAtlas() in habitat.js.
 * @property {string} text
 * @property {string} font              - A CSS font family list.
 * @property {number[]} [tilts]         - How each letter leans, radians clockwise.
 * @property {boolean} [still]          - No flying: they are simply there, sitting.
 * @property {() => void} [onShow]      - Something has been drawn.
 */

/**
 * Spell `text` in butterflies. Returns null if there is no canvas to draw on.
 *
 * @param {SwarmOptions} options
 */
export function createSwarm({
	canvas,
	stage,
	atlas,
	text,
	font,
	tilts = [],
	still = false,
	onShow
}) {
	const pen = canvas.getContext('2d');
	if (!pen) return null;

	let density = 0;
	let form = null; // the shape: where they sit, and how big they are
	let sprites = null;
	let ghost = null;
	let birds = [];
	let pointer = null; // in the window
	let rider = null; // the one sitting on the cursor
	let party = []; // the ones gone to sit on a link
	let courtAgain = 0;
	let frame = 0;
	let last = 0;
	let shown = false;
	let stopped = false;
	let measured = '';
	let dark = document.documentElement.classList.contains('dark');
	const tidy = [];
	const listen = (target, type, handler, options) => {
		target.addEventListener(type, handler, options);
		tidy.push(() => target.removeEventListener(type, handler, options));
	};
	const clock = () => performance.now() / 1000;

	// ----------------------------------------------------------- setting up

	/** The canvas to the window, and the pictures to the screen's pixels. */
	function fit() {
		const ratio = Math.min(window.devicePixelRatio || 1, 2.5);
		canvas.width = Math.round(canvas.clientWidth * ratio);
		canvas.height = Math.round(canvas.clientHeight * ratio);
		pen.imageSmoothingQuality = 'high';
		if (ratio === density) return;
		density = ratio;
		if (form) prepare();
	}

	function prepare() {
		sprites = cut(atlas, Math.ceil(form.unit * 1.12 * 1.4 * density));
		ghost = form.outline(getComputedStyle(stage).color, density);
	}

	function layout() {
		const width = stage.clientWidth;
		const height = stage.clientHeight;
		if (stopped || !width || !height || `${width}x${height}` === measured) return;
		measured = `${width}x${height}`;
		form = shape({ text, font, tilts, width, height, most: width < 480 ? 240 : 360 });
		prepare();
		settle(form.points, width);
		if (still) draw();
	}

	/** Everyone to a place in the shape: new ones fly in, any spare fly off. */
	function settle(points, width) {
		const now = clock();
		const first = !birds.length;
		const homes = [...points].sort((a, b) => a.x - b.x);
		const flock = birds.filter((bird) => !bird.leaving).sort((a, b) => a.hx - b.hx);
		// Paired off in order across the shape, so nobody has far to go.
		const pairs = Math.min(homes.length, flock.length);
		const nth = (list, n) =>
			list[pairs > 1 ? Math.round((n * (list.length - 1)) / (pairs - 1)) : 0];
		const placed = new Set();
		const kept = new Set();
		for (let n = 0; n < pairs; n += 1) {
			const bird = nth(flock, n);
			const home = nth(homes, n);
			placed.add(home);
			kept.add(bird);
			moveHome(bird, home, now);
		}
		for (const bird of flock) if (!kept.has(bird)) flyOff(bird, now);
		for (const home of homes) {
			if (placed.has(home)) continue;
			// The first time, they come in a wave that writes the text left to right.
			const delay = first ? 0.1 + (home.x / width) * 0.9 + between(0, 0.6) : between(0, 0.5);
			birds.push(hatch(home, now + delay));
		}
		for (const bird of birds) bird.span = form.unit * bird.size;
	}

	function hatch(home, wakeAt) {
		const facing = between(-0.7, 0.7);
		return {
			hx: home.x,
			hy: home.y,
			ha: facing,
			x: home.x,
			y: home.y,
			z: 0,
			bob: 0,
			angle: facing,
			heading: 0,
			speed: 0,
			flee: 0,
			dev: 0,
			size: between(0.84, 1.12),
			span: 0,
			pace: between(0.85, 1.2),
			climb: between(24, 50),
			beat: between(7, 10.5),
			phase: Math.random() * TAU,
			seed: Math.random() * TAU,
			open: 1,
			glideUntil: 0,
			panicUntil: 0,
			fanAt: wakeAt + between(4, 18),
			fanFor: 1,
			fanBeats: 1,
			mode: still ? 'perched' : 'waiting',
			wakeAt,
			arriving: !still,
			leaving: false,
			gone: false,
			post: null
		};
	}

	function moveHome(bird, home, now) {
		const moved = Math.hypot(home.x - bird.hx, home.y - bird.hy);
		bird.hx = home.x;
		bird.hy = home.y;
		if (still) [bird.x, bird.y] = [home.x, home.y];
		else if (bird.mode === 'perched' && !bird.post && moved > 2) lift(bird, now);
	}

	// ------------------------------------------------------------ manners

	/** In from just outside the window, on some side, making for home. */
	function wake(bird, view) {
		const w = view.right - view.left;
		const h = view.bottom - view.top;
		const along = Math.random() * (w + h) * 2;
		if (along < w) [bird.x, bird.y] = [view.left + along, view.top - 30];
		else if (along < w * 2) [bird.x, bird.y] = [view.left + along - w, view.bottom + 30];
		else if (along < w * 2 + h) [bird.x, bird.y] = [view.left - 30, view.top + along - w * 2];
		else [bird.x, bird.y] = [view.right + 30, view.top + along - w * 2 - h];
		bird.mode = 'flying';
		bird.heading = Math.atan2(bird.hy - bird.y, bird.hx - bird.x) + between(-0.6, 0.6);
		bird.speed = 460 * bird.pace;
		bird.z = bird.climb;
		bird.angle = bird.heading + Math.PI / 2;
	}

	/** Startled: off, away from (x, y), for a while before it thinks of home. */
	function takeoff(bird, x, y, speed, panic, now, climb = between(28, 56)) {
		const away =
			bird.x === x && bird.y === y ? Math.random() * TAU : Math.atan2(bird.y - y, bird.x - x);
		if (bird === rider) rider = null;
		if (bird.post?.cursor) bird.post = null;
		bird.mode = 'flying';
		bird.heading = away + between(-0.5, 0.5);
		bird.flee = bird.heading;
		bird.speed = Math.max(bird.speed, speed);
		bird.panicUntil = now + panic;
		bird.climb = climb;
		bird.arriving = false;
		bird.glideUntil = 0;
	}

	/** Up, unhurried, and off to wherever it is meant to be now. */
	function lift(bird, now) {
		bird.mode = 'flying';
		bird.panicUntil = now;
		bird.speed = 70;
		bird.heading = bird.angle - Math.PI / 2;
	}

	function flyOff(bird, now) {
		bird.leaving = true;
		bird.post = null;
		takeoff(bird, stage.clientWidth / 2, stage.clientHeight / 2, 200, Infinity, now);
	}

	function land(bird, spot, now) {
		bird.mode = 'perched';
		[bird.x, bird.y] = [spot.x, spot.y];
		bird.z = bird.bob = bird.speed = 0;
		bird.arriving = false;
		// A last close and open of the wings, settling them.
		bird.fanAt = now;
		bird.fanFor = between(0.5, 0.8);
		bird.fanBeats = 1;
	}

	/** Where it means to sit: on the cursor, on a link, or its own place in the shape. */
	function spotFor(bird, cursor) {
		if (bird.post?.cursor) return cursor && { x: cursor.x + 1, y: cursor.y - 9, a: -0.35 };
		return bird.post ?? { x: bird.hx, y: bird.hy, a: bird.ha };
	}

	function sit(bird, dt, now, spot, cursor) {
		// Held on its spot, which might move: the cursor, or the page changing shape.
		[bird.x, bird.y] = [spot.x, spot.y];
		bird.angle += turn(bird.angle, spot.a) * Math.min(1, dt * 5);

		// Every so often it closes and opens its wings, slowly.
		if (now > bird.fanAt + bird.fanFor) {
			bird.fanAt = now + between(5, 20);
			bird.fanFor = between(0.9, 1.5);
			bird.fanBeats = Math.random() < 0.3 ? 2 : 1;
		}
		const t = (now - bird.fanAt) / bird.fanFor;
		bird.open = t > 0 && t < 1 ? 1 - 0.8 * (0.5 - 0.5 * Math.cos(TAU * bird.fanBeats * t)) : 1;

		// The cursor coming through: the faster it comes, the further off they feel it.
		// (Not the ones that came to sit by it, on the cursor or on a link.)
		if (!cursor || bird.post || now - cursor.at > 0.12) return;
		const reach = 20 + Math.min(cursor.speed * 0.07, 80) + bird.span * 0.3;
		if (Math.hypot(bird.x - cursor.x, bird.y - cursor.y) < reach) {
			const speed = 200 + Math.min(cursor.speed * 0.25, 260);
			takeoff(bird, cursor.x, cursor.y, speed, between(0.5, 1.4), now);
		}
	}

	function fly(bird, dt, now, view, spot, cursor) {
		const panicking = now < bird.panicUntil;
		const top = (bird.arriving ? 460 : 220) * bird.pace;
		bird.dev = clamp(bird.dev + between(-1, 1) * dt * 6, -1, 1);

		let want;
		let pace;
		let height;
		let landing = false;
		if (panicking) {
			bird.flee += bird.dev * dt * 2.5;
			want = bird.flee;
			pace = top * 1.25;
			height = bird.climb;
		} else {
			let [tx, ty] = [spot.x, spot.y];
			// A hand over the place it sits: it waits close by, until the hand keeps still.
			const crowded =
				cursor &&
				!bird.post &&
				now - cursor.movedAt < 1 &&
				Math.hypot(spot.x - cursor.x, spot.y - cursor.y) < 48;
			if (crowded) {
				const away = Math.atan2(spot.y - cursor.y, spot.x - cursor.x);
				tx = cursor.x + Math.cos(away) * 84 + Math.cos(now * 2.3 + bird.seed) * 14;
				ty = cursor.y + Math.sin(away) * 84 + Math.sin(now * 2.9 + bird.seed) * 14;
			}
			const far = Math.hypot(tx - bird.x, ty - bird.y);
			want = Math.atan2(ty - bird.y, tx - bird.x) + bird.dev * 0.8 * Math.min(1, far / 240);
			pace = top * clamp(far / (top * 0.45), crowded ? 0.3 : 0.08, 1);
			height = crowded ? bird.climb * 0.6 : bird.climb * clamp((far - 6) / 110, 0, 1);
			landing = !crowded && far < 14;
		}

		// Out of the cursor's way, unless it is making for somewhere by it.
		if (cursor && !bird.post) {
			const near = Math.hypot(bird.x - cursor.x, bird.y - cursor.y);
			if (near < 90) {
				const fear = 1 - near / 90;
				want += turn(want, Math.atan2(bird.y - cursor.y, bird.x - cursor.x)) * fear;
				pace = Math.max(pace, top * (0.6 + fear));
				landing = false;
			}
		}

		// Back in from the edges of the window.
		if (!bird.arriving && !bird.leaving) {
			const wx = bird.x < view.left + 36 ? 1 : bird.x > view.right - 36 ? -1 : 0;
			const wy = bird.y < view.top + 36 ? 1 : bird.y > view.bottom - 36 ? -1 : 0;
			if (wx || wy) {
				const inward = Math.atan2(wy, wx);
				want += turn(want, inward) * 0.7;
				if (panicking) bird.flee += turn(bird.flee, inward) * Math.min(1, dt * 4);
			}
		}

		const agility = 3 + 480 / (bird.speed + 60);
		bird.heading += clamp(turn(bird.heading, want), -agility * dt, agility * dt);
		bird.speed += (pace - bird.speed) * Math.min(1, dt * 3.5);
		bird.x += Math.cos(bird.heading) * bird.speed * dt;
		bird.y += Math.sin(bird.heading) * bird.speed * dt;
		bird.z += (height - bird.z) * Math.min(1, dt * 2.5);

		// The last few pixels: drawn in, and down.
		const left = Math.hypot(spot.x - bird.x, spot.y - bird.y);
		if (landing) {
			const pull = Math.min(1, dt * 8);
			bird.x += (spot.x - bird.x) * pull;
			bird.y += (spot.y - bird.y) * pull;
			bird.z *= 1 - pull;
			if (left < 0.75) return land(bird, spot, now);
		}

		// Head first, until it is about to sit; then it turns the way it will sit.
		const facing = bird.heading + Math.PI / 2;
		const settling = panicking ? 0 : clamp(1 - left / 26, 0, 1);
		const aim = facing + turn(facing, spot.a) * settling;
		bird.angle += turn(bird.angle, aim) * Math.min(1, dt * 10);

		// The wings: beating, and now and then held out for a glide.
		if (now < bird.glideUntil) {
			bird.open = 0.93 + Math.sin(now * 3 + bird.seed) * 0.03;
			bird.bob *= 0.9;
		} else {
			bird.phase += dt * bird.beat * TAU;
			const up = (1 - Math.cos(bird.phase)) / 2; // 0 wings out flat, 1 wings raised
			bird.open = Math.cos(-0.25 + up * 1.6);
			bird.bob = Math.sin(bird.phase) * 1.4;
			if (bird.speed > top * 0.75 && Math.random() < dt * 0.8) {
				bird.glideUntil = now + between(0.25, 0.6);
			}
		}

		if (bird.leaving) {
			const out =
				bird.x < view.left - 120 ||
				bird.x > view.right + 120 ||
				bird.y < view.top - 120 ||
				bird.y > view.bottom + 120;
			if (out) bird.gone = true;
		}
	}

	// ----------------------------------------------------------- the loop

	function tick(ms) {
		frame = requestAnimationFrame(tick);
		const now = ms / 1000;
		const dt = Math.min(Math.max(now - last, 0), 1 / 20);
		last = now;
		const origin = stage.getBoundingClientRect();
		const view = {
			left: -origin.left,
			top: -origin.top,
			right: canvas.clientWidth - origin.left,
			bottom: canvas.clientHeight - origin.top
		};
		const cursor = pointer && {
			x: pointer.x - origin.left,
			y: pointer.y - origin.top,
			speed: now - pointer.at < 0.1 ? pointer.speed : 0,
			at: pointer.at,
			movedAt: pointer.movedAt
		};

		// Whoever is on the cursor lets go when it is shaken, or gone.
		if (rider && (!cursor || cursor.speed > SHAKEN_OFF)) {
			const bird = rider;
			rider = null;
			bird.post = null;
			if (bird.mode === 'perched') lift(bird, now);
		}
		// Leave the cursor lying still for long enough and one comes to sit on it.
		if (
			cursor &&
			!rider &&
			pointer.kind === 'mouse' &&
			now > courtAgain &&
			now - cursor.movedAt > COURTS_AFTER
		) {
			courtAgain = now + 8;
			let nearest = null;
			let best = 420;
			for (const bird of birds) {
				if (bird.mode !== 'perched' || bird.post || bird.leaving) continue;
				const d = Math.hypot(bird.x - cursor.x, bird.y - cursor.y);
				if (d < best) [nearest, best] = [bird, d];
			}
			if (nearest) {
				rider = nearest;
				nearest.post = { cursor: true };
				lift(nearest, now);
			}
		}
		// And now and then one gets up of its own accord, for a little flight.
		if (Math.random() < dt * RESTLESS && birds.length) {
			const bird = birds[Math.floor(Math.random() * birds.length)];
			if (bird.mode === 'perched' && !bird.post) {
				takeoff(bird, bird.x, bird.y + 1, between(90, 150), between(0.4, 1), now, between(10, 22));
			}
		}

		for (const bird of birds) {
			if (bird.mode === 'waiting') {
				if (now < bird.wakeAt) continue;
				wake(bird, view);
			}
			const spot = spotFor(bird, cursor);
			if (!spot) {
				bird.post = null;
				continue;
			}
			if (bird.mode === 'perched') sit(bird, dt, now, spot, cursor);
			else fly(bird, dt, now, view, spot, cursor);
		}
		if (birds.some((bird) => bird.gone)) birds = birds.filter((bird) => !bird.gone);

		draw(origin);
	}

	function draw(origin = stage.getBoundingClientRect()) {
		pen.setTransform(1, 0, 0, 1, 0, 0);
		pen.clearRect(0, 0, canvas.width, canvas.height);
		if (!sprites) return;
		const ox = origin.left * density;
		const oy = origin.top * density;
		if (ghost) {
			pen.globalAlpha = 0.55;
			pen.drawImage(ghost, ox, oy);
		}
		const sitting = [];
		const flying = [];
		for (const bird of birds) {
			if (bird.mode === 'perched') sitting.push(bird);
			else if (bird.mode === 'flying') flying.push(bird);
		}
		flying.sort((a, b) => a.z - b.z);
		// The sitting ones' shadows first, so that none falls across a neighbour.
		for (const bird of sitting) paint(bird, ox, oy, true, false);
		for (const bird of sitting) paint(bird, ox, oy, false, true);
		for (const bird of flying) paint(bird, ox, oy, true, true);
		pen.globalAlpha = 1;
		if (!shown) {
			shown = true;
			onShow?.();
		}
	}

	function paint(bird, ox, oy, withShadow, withBody) {
		const { axis } = sprites;
		const height = Math.max(0, bird.z + bird.bob);
		const k = (bird.span * density * (1 + height * 0.007)) / sprites.frame;
		const cos = Math.cos(bird.angle);
		const sin = Math.sin(bird.angle);
		const x = ox + bird.x * density;
		const y = oy + bird.y * density;
		const open = Math.max(bird.open, 0.08);

		if (withShadow) {
			// Further from the page, the shadow slides off and fades.
			const sk = k * (1 + height * 0.004);
			pen.globalAlpha = 0.24 / (1 + height / 24);
			pen.setTransform(
				cos * sk * open,
				sin * sk * open,
				-sin * sk,
				cos * sk,
				x + (0.8 + height * 0.3) * density,
				y + (1.4 + height * 0.5) * density
			);
			pen.drawImage(sprites.shadow, -axis.x - sprites.pad, -axis.y - sprites.pad);
		}
		if (!withBody) return;
		pen.globalAlpha = 1;
		if (open > 0.985) {
			pen.setTransform(cos * k, sin * k, -sin * k, cos * k, x, y);
			pen.drawImage(sprites.whole, -axis.x, -axis.y);
			return;
		}
		pen.setTransform(cos * k * open, sin * k * open, -sin * k, cos * k, x, y);
		pen.drawImage(sprites.wings, -axis.x, -axis.y);
		pen.setTransform(cos * k, sin * k, -sin * k, cos * k, x, y);
		pen.drawImage(sprites.body, sprites.bodyAt.x - axis.x, sprites.bodyAt.y - axis.y);
	}

	// ------------------------------------------------------------- events

	/** A gust from a click: everyone near enough is blown off, the nearest hardest. */
	function gust(clientX, clientY) {
		const now = clock();
		const origin = stage.getBoundingClientRect();
		const [x, y] = [clientX - origin.left, clientY - origin.top];
		const reach = Math.max(170, form.unit * 9);
		for (const bird of birds) {
			if (bird.mode === 'waiting' || bird.leaving) continue;
			const d = Math.hypot(bird.x - x, bird.y - y);
			if (d > reach) continue;
			const push = 1 - d / reach;
			takeoff(bird, x, y, 160 + push * 380, 0.5 + push * 1.6 + Math.random() * 0.5, now);
		}
	}

	/** The lights going on or off: all of them, up at once. */
	function startle() {
		const now = clock();
		const [x, y] = [stage.clientWidth / 2, stage.clientHeight / 2];
		for (const bird of birds) {
			if (bird.mode === 'waiting' || bird.leaving) continue;
			takeoff(
				bird,
				x + between(-40, 40),
				y + between(-30, 30),
				between(220, 420),
				between(1.2, 2.8),
				now
			);
		}
	}

	function pointed(event) {
		const now = clock();
		const [x, y] = [event.clientX, event.clientY];
		const before = pointer;
		let speed = 0;
		if (before && now - before.at < 0.12) {
			const moved = Math.hypot(x - before.x, y - before.y) / Math.max(now - before.at, 0.008);
			speed = before.speed + (moved - before.speed) * 0.35;
		}
		const shifted = !before || Math.hypot(x - before.x, y - before.y) > 1.5;
		pointer = {
			x,
			y,
			speed,
			at: now,
			movedAt: shifted ? now : before.movedAt,
			kind: event.pointerType
		};
	}

	fit();
	layout();

	const resized = new ResizeObserver(() => requestAnimationFrame(layout));
	resized.observe(stage);
	listen(window, 'resize', () => {
		fit();
		if (still) draw();
	});
	// Theme changes: the outline takes the new ink, and the swarm takes fright.
	const themed = new MutationObserver(() => {
		const now = document.documentElement.classList.contains('dark');
		if (now === dark || !form) return;
		dark = now;
		prepare();
		if (still) draw();
		else startle();
	});
	themed.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

	if (!still) {
		listen(window, 'pointermove', pointed, { passive: true });
		listen(window, 'pointerdown', (event) => {
			pointed(event);
			if (form) gust(event.clientX, event.clientY);
		});
		const lifted = (event) => {
			if (event.pointerType !== 'mouse') pointer = null;
		};
		listen(window, 'pointerup', lifted);
		listen(window, 'pointercancel', lifted);
		listen(document.documentElement, 'pointerleave', () => (pointer = null));
		last = performance.now() / 1000;
		frame = requestAnimationFrame(tick);
	}

	/** A few of the nearest go and sit along the top of an element (a link), until dismissed. */
	function accompany(element) {
		if (still || !form) return;
		dismiss();
		const now = clock();
		const origin = stage.getBoundingClientRect();
		const box = element.getBoundingClientRect();
		const left = box.left - origin.left;
		const top = box.top - origin.top;
		const count = clamp(Math.round(box.width / (form.unit * 0.95)), 2, 7);
		const middle = { x: left + box.width / 2, y: top };
		const distance = (bird) => Math.hypot(bird.x - middle.x, bird.y - middle.y);
		party = birds
			.filter((bird) => bird.mode === 'perched' && !bird.post && !bird.leaving)
			.sort((a, b) => distance(a) - distance(b))
			.slice(0, count);
		party.forEach((bird, n) => {
			const x = left + ((n + 0.5) / count) * box.width;
			bird.post = { x, y: top - form.unit * 0.12, a: between(-0.5, 0.5) };
			lift(bird, now);
		});
	}

	/** Back to their places in the shape, the ones that went to sit on something. */
	function dismiss() {
		const now = clock();
		for (const bird of party) {
			if (!bird.post || bird.post.cursor) continue;
			bird.post = null;
			if (bird.mode === 'perched') lift(bird, now);
		}
		party = [];
	}

	function destroy() {
		stopped = true;
		cancelAnimationFrame(frame);
		resized.disconnect();
		themed.disconnect();
		tidy.forEach((undo) => undo());
	}

	return { accompany, dismiss, destroy };
}
