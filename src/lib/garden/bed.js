// A bed of flowers, grown from numbers rather than cut from a picture.
//
// Three things a monarch actually visits: purple coneflower, butterfly weed
// (the orange milkweed) and blazing star. Each plant is a stem that bends like
// a real one (stiff at the foot, whippy at the top), with leaves that hang off
// it and a flower head that nods a beat behind. They stand in a breeze that
// never quite repeats, lean together when a gust comes through, spring about
// when the cursor is dragged through them and dip when something lands. After
// dark the fireflies come out over them.
//
// No DOM in here beyond the canvas it is given: feed it time, it draws.
// Lengths are CSS pixels; x runs right and y runs down, as on the canvas, with
// the ground along its bottom edge.

const TAU = Math.PI * 2;
const rad = (degrees) => (degrees * Math.PI) / 180;
const clamp = (value, low, high) => Math.min(Math.max(value, low), high);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => {
	const x = clamp(t, 0, 1);
	return x * x * (3 - 2 * x);
};

/** A small repeatable random number generator, so the bed is the same bed every time. */
function seeded(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const STEM_STEPS = 12;

// Colours are [hue, saturation %, lightness %].
const GRASS = { leaf: [104, 36, 29], leafLit: [94, 40, 41] };
const CONE = {
	stem: [84, 26, 27],
	stemLit: [78, 32, 44],
	leaf: [112, 38, 27],
	leafLit: [100, 42, 42],
	petal: [320, 64, 41],
	petalMid: [323, 68, 55],
	petalTip: [326, 74, 70],
	heart: [28, 90, 55],
	heartMid: [17, 78, 37],
	heartEdge: [8, 64, 18],
	spine: [38, 96, 63]
};
const WEED = {
	stem: [96, 34, 30],
	stemLit: [88, 40, 46],
	leaf: [106, 40, 29],
	leafLit: [94, 46, 44],
	skirt: [6, 86, 40],
	crown: [20, 94, 51],
	eye: [42, 98, 63],
	bud: [52, 52, 46],
	stalk: [80, 38, 42]
};
const SPIKE = {
	stem: [92, 34, 32],
	stemLit: [86, 40, 48],
	leaf: [98, 38, 32],
	leafLit: [88, 44, 47],
	deep: [270, 54, 35],
	mid: [279, 60, 49],
	tip: [296, 68, 66],
	bud: [266, 26, 30],
	budTip: [282, 50, 46]
};
const PALETTE = { cone: CONE, weed: WEED, spike: SPIKE };

// What stands where. `x` is from the middle of the bed, `depth` runs from 0
// (front row) to 1 (back row); the back row is drawn first, smaller and paler.
const BEDS = {
	wide: [
		{ kind: 'weed', x: -104, height: 60, depth: 0.15, lean: -8 },
		{ kind: 'cone', x: -70, height: 100, depth: 0.5, lean: -5 },
		{ kind: 'spike', x: -30, height: 140, depth: 1, lean: -1 },
		{ kind: 'cone', x: 4, height: 124, depth: 0.35, lean: 3, sprig: true },
		{ kind: 'weed', x: 44, height: 74, depth: 0, lean: 6 },
		{ kind: 'cone', x: 78, height: 88, depth: 0.2, lean: 8 },
		{ kind: 'spike', x: 112, height: 106, depth: 0.8, lean: 6 }
	],
	middling: [
		{ kind: 'weed', x: -70, height: 58, depth: 0.1, lean: -7 },
		{ kind: 'cone', x: -40, height: 98, depth: 0.45, lean: -4 },
		{ kind: 'spike', x: -6, height: 132, depth: 1, lean: 1 },
		{ kind: 'cone', x: 26, height: 116, depth: 0.3, lean: 4, sprig: true },
		{ kind: 'weed', x: 60, height: 70, depth: 0, lean: 7 }
	],
	narrow: [
		{ kind: 'spike', x: -30, height: 112, depth: 1, lean: -3 },
		{ kind: 'cone', x: -2, height: 94, depth: 0.3, lean: 2 },
		{ kind: 'weed', x: 28, height: 58, depth: 0, lean: 7 }
	]
};

const KINDS = {
	// natural frequency (Hz, for a plant 100px tall), damping, how much wind it catches, stem width foot/top
	cone: { hertz: 1.02, damping: 0.13, sail: 1, foot: 2.3, top: 1.5, bloom: 29 },
	weed: { hertz: 1.45, damping: 0.18, sail: 0.8, foot: 2.1, top: 1.3, bloom: 26 },
	spike: { hertz: 0.82, damping: 0.11, sail: 1.15, foot: 2, top: 0.9, bloom: 0 }
};

/**
 * @typedef {Object} Bloom  Where a flower head is, for anything that wants to sit on it.
 * @property {number} x
 * @property {number} y
 * @property {boolean} open - False until the plant has finished growing.
 */

/** @param {HTMLCanvasElement} canvas */
export function createBed(canvas) {
	const ctx = canvas.getContext('2d');
	let width = 0;
	let height = 0;
	let density = 1;
	let dark = false;
	let time = 0;
	let plants = [];
	let grass = [];
	let gusts = [];
	let gustIn = 2.5;
	let sprout = 1; // 0 while the ground is still bare
	// What is planted comes out the same every time; the weather does not.
	const SEED = 20261002;
	let random = seeded(SEED);
	const between = (low, high) => low + random() * (high - low);
	const chance = (low, high) => low + Math.random() * (high - low);
	let flies = [];
	let dusk = 0; // 0 by day, 1 once it is properly dark

	// ------------------------------------------------------------- planting

	function plant(spec, middle, scale) {
		const kind = KINDS[spec.kind];
		// The back row stands a little smaller, as things further off do.
		const size = scale * lerp(1, 0.86, spec.depth);
		const tall = spec.height * size;
		const made = {
			kind: spec.kind,
			x: middle + spec.x * scale,
			depth: spec.depth,
			size,
			height: tall,
			lean: rad(spec.lean + between(-1.5, 1.5)),
			omega: TAU * kind.hertz * Math.pow(100 / tall, 0.7),
			damping: kind.damping,
			sail: kind.sail,
			foot: kind.foot * size,
			top: kind.top * size,
			bloom: kind.bloom * size,
			// state
			bend: 0,
			bendSpeed: 0,
			nod: 0,
			nodSpeed: 0,
			load: 0,
			grow: 1,
			growIn: 0,
			growFor: 1,
			// where its stem is this frame
			xs: new Float32Array(STEM_STEPS + 1),
			ys: new Float32Array(STEM_STEPS + 1),
			as: new Float32Array(STEM_STEPS + 1),
			leaves: [],
			parts: []
		};

		if (spec.kind === 'cone') {
			const count = 5 + Math.floor(random() * 2);
			for (let n = 0; n < count; n += 1) {
				made.leaves.push({
					at: lerp(0.12, 0.68, n / (count - 1)) + between(-0.03, 0.03),
					side: n % 2 ? 1 : -1,
					length: lerp(27, 15, n / (count - 1)) * size * between(0.9, 1.1),
					width: lerp(8.5, 5, n / (count - 1)) * size,
					angle: rad(between(48, 66)),
					curl: rad(between(22, 42)),
					behind: n % 3 === 0,
					beat: between(2.2, 3.6),
					phase: random() * TAU
				});
			}
			const petals = 15;
			for (let n = 0; n < petals; n += 1) {
				made.parts.push({
					around: (n / petals) * TAU + between(-0.09, 0.09),
					length: between(0.88, 1.12),
					width: between(0.9, 1.1),
					droop: between(-0.12, 0.14),
					hue: between(-5, 5),
					light: between(-3, 4)
				});
			}
			made.spines = Array.from({ length: 40 }, (_, k) => ({
				r: Math.sqrt((k + 0.5) / 40),
				turn: k * 2.39996,
				light: between(-8, 6)
			}));
			// One of them has a second flower coming, still in bud, on a side shoot.
			if (spec.sprig) made.sprig = { at: 0.6, side: 1, length: 21 * size, angle: rad(38) };
		} else if (spec.kind === 'weed') {
			const count = 13;
			for (let n = 0; n < count; n += 1) {
				made.leaves.push({
					at: lerp(0.1, 0.9, n / (count - 1)) + between(-0.02, 0.02),
					side: n % 2 ? 1 : -1,
					length: lerp(19, 12, n / (count - 1)) * size * between(0.88, 1.12),
					width: 3.8 * size,
					angle: rad(between(40, 64)),
					curl: rad(between(8, 26)),
					behind: n % 3 === 1,
					beat: between(3, 4.6),
					phase: random() * TAU
				});
			}
			const florets = 30;
			for (let k = 0; k < florets; k += 1) {
				const tip = Math.acos(1 - (0.9 * (k + 0.5)) / florets);
				const turn = k * 2.39996;
				made.parts.push({
					x: Math.sin(tip) * Math.cos(turn),
					y: Math.cos(tip),
					z: Math.sin(tip) * Math.sin(turn),
					size: between(0.85, 1.12),
					hue: between(-7, 9),
					light: between(-4, 5),
					bud: k < 3
				});
			}
			made.parts.sort((a, b) => a.z - b.z);
		} else {
			const count = 16;
			for (let n = 0; n < count; n += 1) {
				made.leaves.push({
					at: 0.5 * Math.pow(n / (count - 1), 1.5) + 0.02,
					side: random() < 0.5 ? 1 : -1,
					length: lerp(34, 9, n / (count - 1)) * size * between(0.8, 1.2),
					width: 2.1 * size,
					angle: rad(between(16, 50)),
					curl: rad(between(6, 38)),
					behind: n % 4 === 0,
					beat: between(2.6, 4.2),
					phase: random() * TAU
				});
			}
			// The flower spike: tufts all the way up the top of the stem, open at
			// the top and still in bud lower down (blazing star flowers from the top).
			const from = 0.56;
			const tufts = Math.round((tall * (1 - from)) / (1.6 * size));
			for (let n = 0; n < tufts; n += 1) {
				const up = n / (tufts - 1);
				made.parts.push({
					at: lerp(from, 0.995, up),
					side: n % 2 ? 1 : -1,
					splay: rad(between(46, 74)) * lerp(1, 0.35, Math.pow(up, 6)),
					bud: up < 0.24 + between(-0.05, 0.05),
					reach: between(4.6, 6.6) * size * lerp(1, 0.7, up),
					strands: Array.from({ length: 8 }, () => ({
						fan: between(-0.7, 0.7),
						length: between(0.62, 1.1),
						shade: Math.floor(random() * 3)
					}))
				});
			}
		}
		return made;
	}

	function sow(scale, middle) {
		grass = [];
		const span = plants.length ? Math.max(...plants.map((p) => Math.abs(p.x - middle))) + 14 : 40;
		const blades = Math.round(span / 9);
		for (let n = 0; n < blades; n += 1) {
			grass.push({
				x: middle + between(-span, span),
				length: between(10, 36) * scale,
				width: between(1.2, 2) * scale,
				lean: rad(between(-24, 24)),
				curl: rad(between(-34, 34)),
				light: between(-7, 9),
				beat: between(1.6, 3.2),
				phase: random() * TAU,
				back: random() < 0.5
			});
		}
	}

	// --------------------------------------------------------------- weather

	/** How hard the air is pushing at x: a breeze that wanders, and gusts that cross the bed. */
	function wind(x) {
		let push =
			1.5 +
			1.3 * Math.sin(time * 0.37 + x * 0.004) +
			0.8 * Math.sin(time * 0.83 + x * 0.011 + 1.3) +
			0.35 * Math.sin(time * 2.1 + x * 0.03);
		for (const gust of gusts) {
			const from = (x - gust.x - gust.speed * (time - gust.born)) / gust.width;
			if (from > -1 && from < 1) push += gust.power * Math.pow(Math.cos((from * Math.PI) / 2), 2);
		}
		return push;
	}

	function weather(dt) {
		gustIn -= dt;
		if (gustIn <= 0) {
			gustIn = chance(4, 10);
			const back = Math.random() < 0.22; // now and then it comes from the other side
			gusts.push({
				born: time,
				x: back ? width + 160 : -160,
				speed: (back ? -1 : 1) * chance(300, 460),
				width: chance(170, 280),
				power: (back ? -1 : 1) * chance(4, 9)
			});
		}
		gusts = gusts.filter((gust) => time - gust.born < 6);
	}

	// ----------------------------------------------------------------- moving

	function trace(p) {
		// Stiff at the foot, whippy at the top: the bend gathers as it goes up.
		const grown = smooth(p.grow * 1.2);
		const step = (p.height * grown) / STEM_STEPS;
		let x = p.x;
		let y = height + 3;
		let before = 0;
		p.xs[0] = x;
		p.ys[0] = y;
		p.as[0] = 0;
		for (let i = 1; i <= STEM_STEPS; i += 1) {
			const s = i / STEM_STEPS;
			const angle = p.lean * Math.pow(s, 0.9) + p.bend * Math.pow(s, 1.7);
			const mid = (angle + before) / 2;
			x += Math.sin(mid) * step;
			y -= Math.cos(mid) * step;
			before = angle;
			p.xs[i] = x;
			p.ys[i] = y;
			p.as[i] = angle;
		}
	}

	/** A point part of the way up a stem: [x, y, angle]. */
	function along(p, s) {
		const f = clamp(s, 0, 1) * STEM_STEPS;
		const i = Math.min(Math.floor(f), STEM_STEPS - 1);
		const t = f - i;
		return [
			lerp(p.xs[i], p.xs[i + 1], t),
			lerp(p.ys[i], p.ys[i + 1], t),
			lerp(p.as[i], p.as[i + 1], t)
		];
	}

	/**
	 * @param {number} dt
	 * @param {{x: number, y: number, vx: number, vy: number} | null} [hand] - The cursor, in the canvas's own coordinates.
	 */
	function step(dt, hand = null) {
		time += dt;
		weather(dt);
		for (const p of plants) {
			if (p.growIn > 0) {
				p.growIn -= dt;
			} else if (p.grow < 1) {
				p.grow = Math.min(1, p.grow + dt / p.growFor);
			}

			let push = wind(p.x) * p.sail;
			if (hand) {
				// Dragged through the bed, the cursor takes the plants with it.
				const [mx, my] = along(p, 0.75);
				const reach = Math.hypot(hand.x - mx, hand.y - my);
				const tipReach = Math.hypot(hand.x - p.xs[STEM_STEPS], hand.y - p.ys[STEM_STEPS]);
				const near = Math.min(reach, tipReach);
				if (near < 44) push += clamp(hand.vx, -1400, 1400) * 0.034 * (1 - near / 44);
			}
			// Something sitting on the flower weighs it over the way it already leans.
			const sag = p.load * 0.075 * (p.lean + p.bend >= 0 ? 1 : -1);
			p.bendSpeed +=
				(-p.omega * p.omega * (p.bend - sag) - 2 * p.damping * p.omega * p.bendSpeed + push) * dt;
			p.bend = clamp(p.bend + p.bendSpeed * dt, -1, 1);

			// The head is heavy and follows a beat behind the stem under it.
			const follow = -p.bendSpeed * 0.09 + p.load * 0.05;
			p.nodSpeed += (190 * (follow - p.nod) - 13 * p.nodSpeed) * dt;
			p.nod += p.nodSpeed * dt;
			trace(p);
		}
		nightfall(dt);
	}

	// -------------------------------------------------------------- fireflies

	// The big dipper firefly, the one that comes out at dusk over just this
	// sort of planting. Each flies a slow, level line; every six seconds or so
	// it dips, lights up, and swoops upward in a J while the light lasts.
	const FLASH = 0.75; // seconds

	function release(count) {
		flies = Array.from({ length: count }, (_, n) => ({
			x: chance(0.15, 0.85) * width,
			y: chance(0.25, 0.6) * height,
			level: chance(0.25, 0.6) * height,
			way: n % 2 ? 1 : -1,
			pace: chance(9, 17),
			bob: chance(0, TAU),
			flashIn: chance(1.5, 6.5),
			flash: -1, // how far through a flash it is, or -1
			glow: 0
		}));
	}

	function nightfall(dt) {
		dusk = clamp(dusk + (dark ? dt / 2.2 : -dt / 0.8), 0, 1);
		if (dusk <= 0) return;
		for (const fly of flies) {
			if (fly.x < 14) fly.way = 1;
			if (fly.x > width - 14) fly.way = -1;
			fly.x += fly.way * fly.pace * dt;
			fly.bob += dt * 1.3;
			let lift = (fly.level - fly.y) * 0.5 + Math.sin(fly.bob) * 3;
			let light = 0;
			if (fly.flash >= 0) {
				fly.flash += dt / FLASH;
				const t = fly.flash;
				// Down a little, then up and away: the stroke of the J.
				lift = t < 0.3 ? 26 : -64 * Math.sin(Math.min((t - 0.3) / 0.7, 1) * Math.PI * 0.5 + 0.4);
				light = smooth(t / 0.16) * (1 - smooth((t - 0.62) / 0.38));
				if (t >= 1) {
					fly.flash = -1;
					fly.flashIn = chance(5, 7.5);
					fly.level = clamp(fly.y + chance(-8, 14), height * 0.18, height * 0.62);
				}
			} else {
				fly.flashIn -= dt;
				if (fly.flashIn <= 0) fly.flash = 0;
			}
			fly.y = clamp(fly.y + lift * dt, 6, height - 30);
			// The light does not go out all at once.
			fly.glow = Math.max(light, fly.glow - dt * 3.2);
		}
	}

	function fireflies() {
		if (dusk <= 0.01) return;
		ctx.globalCompositeOperation = 'lighter';
		for (const fly of flies) {
			const lit = fly.glow * dusk;
			if (lit < 0.02) continue;
			const halo = ctx.createRadialGradient(fly.x, fly.y, 0, fly.x, fly.y, 11);
			halo.addColorStop(0, `hsl(68 100% 66% / ${(0.55 * lit).toFixed(3)})`);
			halo.addColorStop(0.3, `hsl(72 100% 56% / ${(0.2 * lit).toFixed(3)})`);
			halo.addColorStop(1, 'hsl(76 100% 50% / 0)');
			ctx.fillStyle = halo;
			ctx.fillRect(fly.x - 11, fly.y - 11, 22, 22);
			ctx.beginPath();
			ctx.arc(fly.x, fly.y, 1.25, 0, TAU);
			ctx.fillStyle = `hsl(64 100% 82% / ${lit.toFixed(3)})`;
			ctx.fill();
		}
		ctx.globalCompositeOperation = 'source-over';
	}

	// ---------------------------------------------------------------- drawing

	/** A colour for one plant: paler and greyer towards the back of the bed, dimmer at night. */
	function tones(depth) {
		const fade = depth * 0.13;
		const towards = dark ? 16 : 90;
		return ([h, s, l], lighter = 0, alpha = 1) => {
			const light = lerp((l + lighter) * (dark ? 0.86 : 1), towards, fade);
			const full = s * (1 - depth * 0.16) * (dark ? 0.9 : 1);
			return alpha >= 1
				? `hsl(${h} ${full.toFixed(1)}% ${light.toFixed(1)}%)`
				: `hsl(${h} ${full.toFixed(1)}% ${light.toFixed(1)}% / ${alpha})`;
		};
	}

	/**
	 * A leaf (or a blade of grass): a curling midrib with a pointed blade either
	 * side of it, the upper side catching the light.
	 */
	function leaf(x, y, angle, length, breadth, curl, lit, shade, rib, fat = 0.72, blunt = 0.85) {
		const cx = x + Math.sin(angle) * length * 0.5;
		const cy = y - Math.cos(angle) * length * 0.5;
		const tx = cx + Math.sin(angle + curl) * length * 0.5;
		const ty = cy - Math.cos(angle + curl) * length * 0.5;
		const steps = 7;
		const upper = [];
		const lower = [];
		for (let i = 0; i <= steps; i += 1) {
			const t = i / steps;
			const u = 1 - t;
			const px = u * u * x + 2 * u * t * cx + t * t * tx;
			const py = u * u * y + 2 * u * t * cy + t * t * ty;
			const dx = 2 * u * (cx - x) + 2 * t * (tx - cx);
			const dy = 2 * u * (cy - y) + 2 * t * (ty - cy);
			const size = Math.hypot(dx, dy) || 1;
			// A leaf is widest a third of the way along and drawn out to a point;
			// a petal (fat > 1, blunt < 1) is widest further out and round at the end.
			const half = breadth * 0.5 * Math.pow(Math.sin(Math.PI * Math.pow(t, fat)), blunt);
			const nx = (-dy / size) * half;
			const ny = (dx / size) * half;
			if (ny < 0) {
				upper.push(px + nx, py + ny);
				lower.push(px - nx, py - ny);
			} else {
				upper.push(px - nx, py - ny);
				lower.push(px + nx, py + ny);
			}
		}
		for (const [side, colour] of [
			[lower, shade],
			[upper, lit]
		]) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			for (let i = 0; i < side.length; i += 2) ctx.lineTo(side[i], side[i + 1]);
			ctx.quadraticCurveTo(cx, cy, x, y);
			ctx.fillStyle = colour;
			ctx.fill();
		}
		if (rib) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.quadraticCurveTo(cx, cy, tx, ty);
			ctx.strokeStyle = rib;
			ctx.lineWidth = 0.45;
			ctx.stroke();
		}
	}

	function leaves(p, tone, behind) {
		const green = PALETTE[p.kind];
		const flutter = 0.5 + Math.min(Math.abs(wind(p.x)) / 6, 1.4);
		for (const l of p.leaves) {
			if (l.behind !== behind) continue;
			const open = smooth((p.grow * 1.2 - l.at) / 0.22);
			if (open <= 0) continue;
			const [x, y, angle] = along(p, l.at);
			// Leaves shiver in the breeze and swing against the stem as it moves.
			const shiver = Math.sin(time * l.beat + l.phase) * 0.05 * flutter - p.bendSpeed * 0.07;
			const out = angle + l.side * (l.angle * lerp(0.35, 1, open)) + shiver;
			const dim = behind ? -7 : 0;
			leaf(
				x,
				y,
				out,
				l.length * open,
				l.width * lerp(0.5, 1, open),
				l.side * l.curl + shiver,
				tone(green.leafLit, dim),
				tone(green.leaf, dim),
				l.width > 3 * p.size ? tone(green.stem, -6, 0.55) : null
			);
		}
	}

	function stem(p, tone) {
		ctx.beginPath();
		for (let i = 0; i <= STEM_STEPS; i += 1) {
			const half = lerp(p.foot, p.top, i / STEM_STEPS) / 2;
			const x = p.xs[i] - Math.cos(p.as[i]) * half;
			const y = p.ys[i] - Math.sin(p.as[i]) * half;
			if (i) ctx.lineTo(x, y);
			else ctx.moveTo(x, y);
		}
		for (let i = STEM_STEPS; i >= 0; i -= 1) {
			const half = lerp(p.foot, p.top, i / STEM_STEPS) / 2;
			ctx.lineTo(p.xs[i] + Math.cos(p.as[i]) * half, p.ys[i] + Math.sin(p.as[i]) * half);
		}
		ctx.closePath();
		ctx.fillStyle = tone(PALETTE[p.kind].stem);
		ctx.fill();
		// The side the light is on.
		ctx.beginPath();
		for (let i = 0; i <= STEM_STEPS; i += 1) {
			const half = lerp(p.foot, p.top, i / STEM_STEPS) * 0.28;
			const x = p.xs[i] - Math.cos(p.as[i]) * half;
			const y = p.ys[i] - Math.sin(p.as[i]) * half;
			if (i) ctx.lineTo(x, y);
			else ctx.moveTo(x, y);
		}
		ctx.strokeStyle = tone(PALETTE[p.kind].stemLit, 0, 0.75);
		ctx.lineWidth = p.top * 0.42;
		ctx.stroke();
	}

	/**
	 * A coneflower head: a spiny orange heart with pink petals hanging round it
	 * like a skirt. `open` runs from a tight green bud (0) to full flower (1).
	 */
	function coneHead(x, y, angle, across, open, p, tone, swing) {
		const d = across * lerp(0.4, 1, open);
		const rx = 0.22 * d;
		const ry = 0.06 * d;
		const rise = 0.3 * d;
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(angle);

		const petal = (part, back) => {
			// In bud they stand straight up; open, they hang below the level.
			const droop = lerp(-1.25, 0.7, open) + part.droop * open - swing * 0.02;
			const dx = Math.cos(part.around) * Math.cos(droop);
			const dy = Math.sin(part.around) * Math.cos(droop) * 0.16 + Math.sin(droop) * 0.98;
			// Those pointing at the reader, or away, are seen end-on and so look shorter.
			const seen = Math.hypot(dx, dy);
			const length = 0.64 * d * part.length * lerp(0.42, 1, open) * lerp(0.6, 1, seen);
			const breadth = 0.158 * d * part.width * lerp(0.7, 1, open);
			const ax = rx * Math.cos(part.around);
			const ay = ry * Math.sin(part.around);
			const way = Math.atan2(dx, -dy); // as leaf() measures: from straight up, clockwise
			const dim = (back ? -9 : 0) + part.light;
			const hue = (colour) => [colour[0] + part.hue, colour[1], colour[2]];
			const wash = (shadow) => {
				const paint = ctx.createLinearGradient(
					ax,
					ay,
					ax + Math.sin(way) * length,
					ay - Math.cos(way) * length
				);
				paint.addColorStop(0, tone(hue(CONE.petal), dim - shadow));
				paint.addColorStop(0.55, tone(hue(CONE.petalMid), dim - shadow));
				paint.addColorStop(1, tone(hue(CONE.petalTip), dim - shadow * 0.5));
				return paint;
			};
			// They hang, so each curls a little further down towards its tip.
			const sag = (dx >= 0 ? 1 : -1) * 0.34 * open;
			leaf(
				ax,
				ay,
				way,
				length,
				breadth,
				sag,
				wash(0),
				wash(7),
				tone(hue(CONE.petal), dim - 12, 0.3),
				1.35,
				0.42
			);
		};

		// The green cup it all grows from.
		ctx.beginPath();
		ctx.ellipse(0, ry * 0.7, rx * 0.82, ry * 1.6, 0, 0, TAU);
		ctx.fillStyle = tone(CONE.leaf, -4);
		ctx.fill();

		for (const part of p.parts) if (Math.sin(part.around) < 0) petal(part, true);

		const heart = ctx.createRadialGradient(-0.06 * d, -0.17 * d, 0, 0, -0.05 * d, 0.32 * d);
		// Green while it is in bud, ripening to orange as it opens.
		const ripe = (colour) => [lerp(86, colour[0], open), lerp(34, colour[1], open), colour[2]];
		heart.addColorStop(0, tone(ripe(CONE.heart)));
		heart.addColorStop(0.5, tone(ripe(CONE.heartMid)));
		heart.addColorStop(1, tone(ripe(CONE.heartEdge)));
		ctx.beginPath();
		ctx.moveTo(-rx, 0);
		ctx.bezierCurveTo(-rx, -rise, rx, -rise, rx, 0);
		ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI);
		ctx.fillStyle = heart;
		ctx.fill();
		// Its spines, set in the same spiral as the seeds of a sunflower.
		for (const spine of p.spines) {
			const sx = rx * spine.r * Math.cos(spine.turn) * 0.94;
			const depth = spine.r * Math.sin(spine.turn);
			const sy = -rise * 0.74 * Math.sqrt(1 - spine.r * spine.r) + ry * depth * 0.8 - rise * 0.02;
			const size = 0.027 * d * lerp(1, 0.6, spine.r);
			ctx.beginPath();
			ctx.arc(sx + size * 0.5, sy + size * 0.7, size, 0, TAU);
			ctx.fillStyle = tone(CONE.heartEdge, -4, 0.5);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(sx, sy, size, 0, TAU);
			ctx.fillStyle = tone(ripe(CONE.spine), spine.light - 14 * spine.r, 0.94);
			ctx.fill();
		}

		for (const part of p.parts) if (Math.sin(part.around) >= 0) petal(part, false);
		ctx.restore();
	}

	function coneflower(p, tone) {
		if (p.sprig && p.grow * 1.2 > p.sprig.at) {
			// The side shoot, with next week's flower on the end of it.
			const { at, side, length, angle } = p.sprig;
			const out = smooth((p.grow * 1.2 - at) / 0.4);
			const [x, y, lean] = along(p, at);
			const way = lean + side * angle;
			const cx = x + Math.sin(way) * length * 0.55 * out;
			const cy = y - Math.cos(way) * length * 0.55 * out;
			const tx = cx + Math.sin(way - side * 0.5) * length * 0.5 * out;
			const ty = cy - Math.cos(way - side * 0.5) * length * 0.5 * out;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.quadraticCurveTo(cx, cy, tx, ty);
			ctx.strokeStyle = tone(CONE.stem);
			ctx.lineWidth = p.top * 0.72;
			ctx.stroke();
			leaf(
				x,
				y,
				way + side * 0.5,
				9 * p.size * out,
				3.4 * p.size,
				side * 0.4,
				tone(CONE.leafLit),
				tone(CONE.leaf),
				null
			);
			if (out > 0.3)
				coneHead(tx, ty, lean + side * 0.16 + p.nod, p.bloom * 0.62 * out, 0.16, p, tone, 0);
		}
		// The bud is there from early on, small and green, and fattens as it rises.
		const young = smooth((p.grow - 0.1) / 0.5);
		if (young <= 0.02) return;
		const [x, y, angle] = along(p, 1);
		const open = smooth((p.grow - 0.7) / 0.3);
		coneHead(x, y, angle + p.nod, p.bloom * lerp(0.3, 1, young), open, p, tone, p.nodSpeed);
	}

	/** Butterfly weed: a dome of small orange flowers, each on a stalk of its own. */
	function butterflyWeed(p, tone) {
		const [x, y, angle] = along(p, 1);
		const young = smooth((p.grow - 0.1) / 0.5);
		if (young <= 0.02) return;
		const open = smooth((p.grow - 0.66) / 0.34);
		const r = p.bloom * 0.5 * lerp(0.4, 1, open) * lerp(0.3, 1, young);
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(angle + p.nod);
		const place = (f) => [f.x * r, -(f.y * r * 0.56) + f.z * r * 0.24 - 0.16 * r];

		ctx.beginPath();
		for (const f of p.parts) {
			const [fx, fy] = place(f);
			ctx.moveTo(0, r * 0.16);
			ctx.lineTo(fx, fy + r * 0.1);
		}
		ctx.strokeStyle = tone(WEED.stalk, 0, 0.9);
		ctx.lineWidth = 0.5;
		ctx.stroke();

		for (const f of p.parts) {
			const [fx, fy] = place(f);
			const size = p.bloom * 0.082 * f.size * lerp(0.55, 1, open) * lerp(0.4, 1, young);
			// Further back in the head is further from the light.
			const dim = lerp(-11, 3, (f.z + 1) / 2) + f.light;
			const hue = (colour) => [colour[0] + f.hue, colour[1], colour[2]];
			if (f.bud || open < 0.5) {
				ctx.beginPath();
				ctx.ellipse(fx, fy, size * 0.6, size * 0.78, 0, 0, TAU);
				ctx.fillStyle = tone(open > 0.5 ? WEED.bud : WEED.leafLit, dim);
				ctx.fill();
				continue;
			}
			// Each is five petals flung back underneath and a crown of five horns
			// on top; at this size, a dark skirt, a bright cap and a yellow eye.
			ctx.beginPath();
			ctx.ellipse(fx, fy + size * 0.5, size * 1.08, size * 0.5, 0, 0, TAU);
			ctx.fillStyle = tone(hue(WEED.skirt), dim);
			ctx.fill();
			ctx.beginPath();
			ctx.ellipse(fx, fy - size * 0.1, size * 0.8, size * 0.6, 0, 0, TAU);
			ctx.fillStyle = tone(hue(WEED.crown), dim);
			ctx.fill();
			ctx.beginPath();
			ctx.ellipse(fx, fy - size * 0.2, size * 0.34, size * 0.26, 0, 0, TAU);
			ctx.fillStyle = tone(hue(WEED.eye), dim * 0.5);
			ctx.fill();
		}
		ctx.restore();
	}

	/** Blazing star: a tall wand feathered with purple from the top down. */
	function blazingStar(p, tone) {
		const open = smooth((p.grow - 0.6) / 0.4);
		const strokes = [[], [], []];
		const buds = [];
		for (const tuft of p.parts) {
			if (p.grow * 1.2 < tuft.at) continue;
			const [x, y, angle] = along(p, tuft.at);
			const out = angle + tuft.side * tuft.splay + p.nod * 2;
			const bx = x + Math.cos(angle) * tuft.side * p.top * 0.5;
			const by = y + Math.sin(angle) * tuft.side * p.top * 0.5;
			if (tuft.bud || open < 0.35) {
				buds.push(bx, by, out, tuft.reach * 0.36);
				continue;
			}
			for (const strand of tuft.strands) {
				const way = out + strand.fan;
				const reach = tuft.reach * strand.length * lerp(0.4, 1, open);
				strokes[strand.shade].push(bx, by, bx + Math.sin(way) * reach, by - Math.cos(way) * reach);
			}
		}
		// Still in bud lower down: green-purple scales, each with a purple tip.
		for (let i = 0; i < buds.length; i += 4) {
			const [bx, by, out, reach] = [buds[i], buds[i + 1], buds[i + 2], buds[i + 3]];
			ctx.beginPath();
			ctx.ellipse(
				bx + Math.sin(out) * reach,
				by - Math.cos(out) * reach,
				reach * 0.62,
				reach * 0.9,
				out,
				0,
				TAU
			);
			ctx.fillStyle = tone(SPIKE.bud);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(
				bx + Math.sin(out) * reach * 1.8,
				by - Math.cos(out) * reach * 1.8,
				reach * 0.34,
				0,
				TAU
			);
			ctx.fillStyle = tone(SPIKE.budTip);
			ctx.fill();
		}
		ctx.lineCap = 'round';
		ctx.lineWidth = 0.9 * p.size;
		[SPIKE.deep, SPIKE.mid, SPIKE.tip].forEach((colour, shade) => {
			const lines = strokes[shade];
			ctx.beginPath();
			for (let i = 0; i < lines.length; i += 4) {
				ctx.moveTo(lines[i], lines[i + 1]);
				ctx.lineTo(lines[i + 2], lines[i + 3]);
			}
			ctx.strokeStyle = tone(colour);
			ctx.stroke();
		});
		ctx.lineCap = 'butt';
	}

	function blades(back) {
		const tone = tones(back ? 0.75 : 0.1);
		// The grass is up first, before anything else has shown.
		const up = plants.length ? smooth(Math.max(...plants.map((p) => p.grow)) * 5 + sprout) : 1;
		for (const blade of grass) {
			if (blade.back !== back) continue;
			const sway = wind(blade.x) * 0.014 + Math.sin(time * blade.beat + blade.phase) * 0.04;
			leaf(
				blade.x,
				height + 2,
				blade.lean + sway,
				blade.length * up,
				blade.width,
				blade.curl + sway * 2.4,
				tone(GRASS.leafLit, blade.light),
				tone(GRASS.leaf, blade.light),
				null
			);
		}
	}

	function comeUp() {
		sprout = 0;
		plants.forEach((p) => {
			p.grow = 0;
			p.growIn = chance(0, 1.1) + p.depth * 0.3;
			p.growFor = chance(1.7, 2.6);
			p.bend = p.bendSpeed = 0;
		});
	}

	function draw() {
		ctx.setTransform(density, 0, 0, density, 0, 0);
		ctx.clearRect(0, 0, width, height);
		blades(true);
		for (const p of plants) {
			if (p.grow <= 0) continue;
			const tone = tones(p.depth);
			leaves(p, tone, true);
			stem(p, tone);
			leaves(p, tone, false);
			if (p.kind === 'cone') coneflower(p, tone);
			else if (p.kind === 'weed') butterflyWeed(p, tone);
			else blazingStar(p, tone);
		}
		blades(false);
		fireflies();
	}

	return {
		/**
		 * Plant the bed to fit a canvas `across` by `tall` CSS pixels. Narrow
		 * beds get fewer plants, not smaller ones.
		 */
		layout(across, tall, pixels, night) {
			width = across;
			height = tall;
			density = pixels;
			dark = night;
			canvas.width = Math.round(across * pixels);
			canvas.height = Math.round(tall * pixels);
			const bed = across >= 280 ? BEDS.wide : across >= 180 ? BEDS.middling : BEDS.narrow;
			const scale = across >= 280 ? 1 : across >= 180 ? 0.94 : 0.84;
			// A narrow bed keeps to the right, clear of whatever is beside it.
			const middle = across >= 180 ? across / 2 : across - 46;
			const before = plants;
			random = seeded(SEED);
			plants = [...bed].sort((a, b) => b.depth - a.depth).map((spec) => plant(spec, middle, scale));
			sow(scale, middle);
			if (before.length === plants.length) {
				// The same bed at another size: carry on from where it was.
				const state = ['bend', 'bendSpeed', 'nod', 'nodSpeed', 'load', 'grow', 'growIn', 'growFor'];
				plants.forEach((p, n) => state.forEach((key) => (p[key] = before[n][key])));
			} else if (before.some((p) => p.grow < 1)) {
				comeUp();
			}
			for (const p of plants) trace(p);
			if (flies.length !== (across >= 280 ? 3 : across >= 180 ? 2 : 1)) {
				release(across >= 280 ? 3 : across >= 180 ? 2 : 1);
			}
		},

		setNight(night) {
			dark = night;
		},

		/** Start again from bare ground and come up, one after another. */
		grow: comeUp,

		get grown() {
			return plants.every((p) => p.grow >= 1);
		},

		step,
		draw,

		/** @returns {Bloom[]} Somewhere to sit on each plant, in the canvas's coordinates. */
		blooms() {
			return plants.map((p) => {
				// On top of a flower head; clinging to the side of a spike near its top.
				const [x, y, angle] = along(p, p.kind === 'spike' ? 0.86 : 1);
				const lift = p.kind === 'cone' ? p.bloom * 0.2 : p.kind === 'weed' ? p.bloom * 0.4 : 0;
				const aside = p.kind === 'spike' ? 4 * p.size : 0;
				return {
					x: x + Math.sin(angle + p.nod) * lift + Math.cos(angle) * aside,
					y: y - Math.cos(angle + p.nod) * lift + Math.sin(angle) * aside,
					open: p.grow >= 1
				};
			});
		},

		/** Something has landed on plant `index` (in blooms() order): it dips. */
		land(index) {
			const p = plants[index];
			if (!p) return;
			p.load = 1;
			p.bendSpeed += 0.75 * (p.lean + p.bend >= 0 ? 1 : -1);
			p.nodSpeed += 1.6;
		},

		/** ...and has gone again: it springs back. */
		leave(index) {
			const p = plants[index];
			if (!p) return;
			p.load = 0;
			p.bendSpeed -= 0.6 * (p.lean + p.bend >= 0 ? 1 : -1);
			p.nodSpeed -= 1.3;
		}
	};
}
