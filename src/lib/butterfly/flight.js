// How the butterfly moves. No DOM in here: feed it time, get back a pose.
//
// The page is treated as a wall the butterfly basks on, back to the reader.
// Leaving it, the first downstroke throws the butterfly off the wall, it tips
// forward into level flight and from then on the reader sees it from the side,
// from behind, from in front, as it turns. Up the screen is up.
//
// What makes it read as a butterfly rather than a bird or a bee:
//  - a slow, deep wingbeat (7 to 10 a second) that visibly bounces a body this
//    light: up on the downstroke, forward on the upstroke. No two beats alike;
//  - it never holds a line. A couple of times a second it changes its mind:
//    over to the other side, a hop, a drop, a dart. That is what makes
//    butterflies so hard for birds to catch;
//  - monarchs glide. A few beats, then the wings are held in a shallow V and it
//    sails and sinks a little, then beats again;
//  - to land on a wall it turns to face it, rears up until its body is upright,
//    flutters in and then fans its wings a couple of times once it has a grip.
//
// Units are page pixels and seconds. World axes are x right, y up (so the
// opposite of the page's y) and z out of the page towards the reader.

const TAU = Math.PI * 2;
const rad = (degrees) => (degrees * Math.PI) / 180;
const clamp = (value, low, high) => Math.min(Math.max(value, low), high);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => {
	const x = clamp(t, 0, 1);
	return x * x * (3 - 2 * x);
};
/** Wrap an angle into (-PI, PI]. */
const wrap = (angle) => {
	const turned = (angle + Math.PI) % TAU;
	return (turned < 0 ? turned + TAU : turned) - Math.PI;
};
/** Ease `value` towards `target`; `rate` is per second and the result does not depend on the frame rate. */
const ease = (value, target, rate, dt) => value + (target - value) * (1 - Math.exp(-rate * dt));

// Wings: 0 is flat out to the side, positive is up over the back.
const REST = rad(7);
const POISED = rad(60); // half closed, ready to go
const TOP = rad(76);
const DIHEDRAL = rad(27); // held in a V to glide
const DOWNSTROKE = 0.44; // share of a beat spent on the way down
const TIP_LAG = 0.085; // the wing tip trails the root by this much of a beat...
const TRAIL_LAG = 0.06; // ...and the hindwing trails the leading edge
const SWEEP = rad(9);
const FULL_BEAT = rad(53);

// Flight.
const CRUISE = 225; // px/s over the ground
const CLIMB = 200;
const SINK = 230;
const DRAG = 5.5; // per second: a butterfly stops almost as soon as it stops beating
const DRAG_GLIDING = 1.5;
const DEPTH_DRAG = 2.4; // it flies along the page far more readily than towards the reader
const BOUNCE = 8200; // px/s² the body is shoved up (then let drop) by each beat
const BOUNCE_SPRING = 36; // what brings the bouncing back to the line it is flying
const BOUNCE_DAMPING = 8.4;
const WEAVE = 190; // px it swings either side of the straight line there
const SWELL = 110; // px/s it rises and falls about a steady climb
const TURN_GAIN = 7;
const TURN_MAX = 7.5; // rad/s
const CRUISE_DEPTH = 62; // how far off the page it likes to fly
const DEPTH_LIMIT = 118;
const STANDOFF = 44; // it lines up this far off the page before coming in
const LANDING_RANGE = 62;
const INTO_PAGE = -Math.PI / 2;
const DEPTH_OF_FIELD = 260; // how fast it grows as it comes towards the reader

const cross = (a, b) => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0]
];

/** Body frame [r, f, u] of a butterfly in level-ish flight. */
function flightFrame(yaw, pitch, roll) {
	const cy = Math.cos(yaw);
	const sy = Math.sin(yaw);
	const cp = Math.cos(pitch);
	const sp = Math.sin(pitch);
	const f = [cy * cp, sp, sy * cp];
	const up = [-cy * sp, cp, -sy * sp];
	const right = cross(f, up);
	const cr = Math.cos(roll);
	const sr = Math.sin(roll);
	return {
		f,
		u: up.map((value, i) => value * cr - right[i] * sr)
	};
}

/** Body frame of a butterfly flat on the page, leaning `tilt` clockwise. */
function sittingFrame(tilt) {
	return { f: [Math.sin(tilt), Math.cos(tilt), 0], u: [0, 0, 1] };
}

/** Blend two frames and square the result up again. */
function mixFrames(a, b, t) {
	let f = a.f.map((value, i) => lerp(value, b.f[i], t));
	let length = Math.hypot(...f);
	if (length < 0.05) f = t < 0.5 ? a.f : b.f;
	else f = f.map((value) => value / length);

	let u = a.u.map((value, i) => lerp(value, b.u[i], t));
	const along = u[0] * f[0] + u[1] * f[1] + u[2] * f[2];
	u = u.map((value, i) => value - f[i] * along);
	length = Math.hypot(...u);
	if (length < 0.05) u = t < 0.5 ? a.u : b.u;
	else u = u.map((value) => value / length);

	return [...cross(f, u), ...f, ...u];
}

/** Position within a beat (0 at the top) with the downstroke taking less than half of it. */
function stroke(phase) {
	const p = ((phase % TAU) + TAU) % TAU;
	const down = TAU * DOWNSTROKE;
	return p < down ? (p / down) * Math.PI : Math.PI + ((p - down) / (TAU - down)) * Math.PI;
}
// sin(stroke) averages to this over a beat; taken off so the bounce nets to nothing.
const STROKE_BIAS = (2 / Math.PI) * (2 * DOWNSTROKE - 1);

/** A slow wander in [-1, 1] that never quite repeats. */
function wanderer(random, hertz) {
	const waves = [1, 1.83, 3.17].map((multiple) => ({
		speed: hertz * multiple * (0.8 + random() * 0.4) * TAU,
		offset: random() * TAU
	}));
	return (time) =>
		0.55 * Math.sin(time * waves[0].speed + waves[0].offset) +
		0.3 * Math.sin(time * waves[1].speed + waves[1].offset) +
		0.15 * Math.sin(time * waves[2].speed + waves[2].offset);
}

/**
 * @typedef {Object} Spot  A place on the page.
 * @property {number} x
 * @property {number} y        - Page coordinates (y down).
 * @property {number} [tilt]   - How it leans when sitting there, radians clockwise.
 *
 * @typedef {Object} Surroundings
 * @property {{x: number, y: number} | null} [pointer] - Where the reader's cursor is, on the page.
 * @property {{left: number, right: number}} [bounds]  - Page x it should stay between.
 */

/** @param {{ random?: () => number }} [options] */
export function createFlight({ random = Math.random } = {}) {
	const between = (low, high) => low + random() * (high - low);
	const noise = {
		turn: wanderer(random, 0.62),
		speed: wanderer(random, 0.4),
		roll: wanderer(random, 1.3),
		depth: wanderer(random, 0.33)
	};

	const s = {
		mode: 'perched', // perched | windup | flying | landing
		time: 0,
		since: 0,
		x: 0,
		y: 0,
		z: 0,
		vx: 0,
		vy: 0,
		vz: 0,
		bob: 0, // how far each wingbeat has bounced it off the line it is flying
		bobSpeed: 0,
		yaw: INTO_PAGE,
		yawRate: 0,
		pitch: rad(80),
		pitchBase: rad(80),
		roll: 0,
		lean: 0,
		blend: 1, // 1: sitting on the page, 0: in the air
		tilt: 0,
		target: { x: 0, y: 0, tilt: 0 },
		// wings
		phase: 0,
		freq: 8,
		amp: rad(45),
		mean: rad(21),
		hold: 1, // 1: wings held at `held`, 0: beating
		held: REST,
		heldSpeed: 0,
		// sitting
		wary: 0,
		settle: 0,
		fan: null,
		fanIn: between(2, 5),
		fans: 0,
		turnIn: between(6, 14),
		tiltGoal: 0,
		flick: 0,
		// flying
		flee: 0,
		fleeDir: [0, 1],
		via: [], // places to pass on the way, so it never goes straight there
		haste: 1,
		kick: 0,
		dart: 0,
		sway: 0, // which side of the straight line it currently fancies, -1 to 1
		swayIn: 0.5,
		heave: 0, // and whether it fancies being higher or lower
		jinkIn: 0.4,
		beat: 1, // how hard this particular beat is, and
		tempo: 1, // how quick; no two are the same
		spook: 0,
		gliding: false,
		glideLeft: 0,
		beatsLeft: 6
	};

	const beatAngle = (lag, amp) => s.mean + amp * Math.cos(stroke(s.phase - lag * TAU));
	/** Put the beat where the wings already are, heading down, so nothing jumps. */
	function resumeBeat(angle) {
		const at = Math.acos(clamp((angle - s.mean) / s.amp, -1, 1));
		s.phase = (at / Math.PI) * TAU * DOWNSTROKE;
	}

	function spring(dt, target, stiffness, damping) {
		s.heldSpeed +=
			(stiffness * stiffness * (target - s.held) - 2 * damping * stiffness * s.heldSpeed) * dt;
		s.held += s.heldSpeed * dt;
	}

	// ---------------------------------------------------------------- sitting

	function sit(dt) {
		let target = REST;
		let stiffness = 6.5;
		let damping = 1;

		if (s.fan) {
			target = s.fan.angle;
			stiffness = s.fan.stiffness;
			if (s.time >= s.fan.until) {
				s.fan = null;
				s.fanIn = s.fans > 0 ? between(0.45, 0.9) : between(3.5, 9);
			}
		} else {
			s.fanIn -= dt;
			if (s.fanIn <= 0) {
				if (s.fans <= 0) s.fans = random() < 0.35 ? 2 : 1;
				s.fans -= 1;
				const lingering = random() < 0.25;
				s.fan = {
					angle: rad(between(52, 78)),
					stiffness: between(5.5, 8),
					until: s.time + (lingering ? between(1.4, 2.6) : between(0.5, 0.9))
				};
			}
		}

		// Now and then it shuffles round to face another way, with a flick of the wings.
		s.turnIn -= dt;
		if (s.turnIn <= 0) {
			s.turnIn = between(7, 18);
			const way = random() < 0.5 ? -1 : 1;
			s.tiltGoal = clamp(s.tilt + way * between(0.12, 0.38), -0.62, 0.36);
			s.flick = 0.22;
		}
		s.tilt = ease(s.tilt, s.tiltGoal, 6, dt);
		if (s.flick > 0) {
			s.flick -= dt;
			target = Math.max(target, rad(26));
			stiffness = 20;
		}

		if (s.settle > 0) {
			// Just landed: the wings ring a little before they come to rest.
			s.settle -= dt;
			stiffness = 17;
			damping = 0.32;
		}
		if (s.wary > 0.02) {
			// Something is coming. Wings half up, ready to go.
			target = Math.max(target, lerp(REST, POISED, s.wary));
			stiffness = 24;
			damping = 0.8;
		}
		spring(dt, target, stiffness, damping);
	}

	function windup(dt) {
		spring(dt, TOP, 62, 0.9);
		if (s.held > rad(62) || s.since > 0.1) launch();
	}

	function launch() {
		s.mode = 'flying';
		s.since = 0;
		s.freq = 9.6;
		s.amp = rad(55);
		s.mean = rad(21);
		s.tempo = 1;
		resumeBeat(s.held);
		s.hold = 0;
		s.wary = 0;
		s.settle = 0;
		s.fan = null;

		// The first downstroke shoves it straight off the page, back first.
		const [ax, ay] = s.fleeDir;
		const scared = s.flee > 0.4;
		s.vx = ax * (scared ? 150 : 70);
		s.vy = ay * (scared ? 110 : 60) + (scared ? 90 : 60);
		s.vz = scared ? 300 : 210;
		s.bob = s.bobSpeed = 0;
		s.yaw = INTO_PAGE;
		s.yawRate = 0;
		s.pitchBase = rad(80);
		s.pitch = s.pitchBase;
		s.roll = 0;
		s.kick = 0;
		s.dart = 0;
		s.sway = between(-1, 1);
		s.swayIn = between(0.5, 1.1);
		s.heave = 0;
		s.jinkIn = between(0.25, 0.5);
		s.gliding = false;
		s.beatsLeft = Math.round(between(5, 9));
	}

	// ----------------------------------------------------------------- flying

	/**
	 * A body this light under wings this big gets bounced by every beat: shoved
	 * up on the downstroke, let drop on the upstroke. It rides on top of the line
	 * the butterfly is flying rather than changing it.
	 */
	function bounce(dt, strength, at, firmness) {
		const shove = BOUNCE * strength * (Math.sin(at) - STROKE_BIAS);
		s.bobSpeed +=
			(shove - BOUNCE_SPRING * firmness * s.bob - BOUNCE_DAMPING * firmness * s.bobSpeed) * dt;
		s.bob += s.bobSpeed * dt;
	}

	/**
	 * The sudden change of mind, a couple of times a second: a new height to
	 * make for, and often a hop, a drop or a change of pace. (These are the
	 * things that show on a page; a swerve in depth would only change its size.)
	 */
	function jink() {
		s.jinkIn = between(0.3, 0.95) * (s.flee > 0 ? 0.6 : 1);
		s.heave = between(-1, 1);
		const roll = random();
		if (roll < 0.3) s.vy += between(90, 170);
		else if (roll < 0.52) s.vy -= between(80, 150);
		else if (roll < 0.7) s.dart = between(0.5, 0.9);
		else if (roll < 0.82) s.dart = -between(0.35, 0.55);
		if (random() < 0.5) s.kick += (random() < 0.5 ? -1 : 1) * between(0.4, 1.1);
	}

	/** A new side to swing out to. Usually the other one, which is what makes it zigzag. */
	function swerve() {
		s.swayIn = between(0.5, 1.3);
		const side = (s.sway > 0 ? -1 : 1) * (random() < 0.75 ? 1 : -1);
		s.sway = side * between(0.4, 1);
	}

	/** @param {Surroundings} around */
	function fly(dt, around) {
		const fleeing = s.flee > 0;
		if (fleeing) s.flee -= dt;

		const via = fleeing ? null : s.via[0];
		let goal = { x: s.target.x, y: -s.target.y + 5, z: STANDOFF };
		if (fleeing) goal = { x: s.x + s.fleeDir[0] * 220, y: s.y + s.fleeDir[1] * 220, z: 78 };
		else if (via) goal = { x: via.x, y: -via.y, z: CRUISE_DEPTH };
		const dx = goal.x - s.x;
		const dy = goal.y - s.y;
		const dz = goal.z - s.z;
		const distance = Math.hypot(dx, dy, dz);
		// Near enough to somewhere it was only passing: on to the next place.
		if (via && Math.hypot(dx, dy) < 85) s.via.shift();
		const passing = fleeing || Boolean(via);
		const far = passing ? 1 : smooth(distance / 320);

		// Where it would like to head, across the page and in depth. It swings
		// from side to side on the way, most of all when the way is straight up or
		// down, and rises and falls as it goes.
		const loose = fleeing ? 0.4 : via ? 0.7 : smooth(distance / 260);
		const steep = Math.abs(dy) / (Math.abs(dx) + Math.abs(dy) + 1);
		const depth = lerp(STANDOFF, CRUISE_DEPTH + 26 * noise.depth(s.time), far);
		let ax = dx + WEAVE * s.sway * loose * (0.35 + 0.65 * steep);
		let az = ((fleeing ? goal.z : depth) - s.z) * 2.6;
		let climb = clamp(dy * 2, -SINK * s.haste, CLIMB * s.haste) + SWELL * s.heave * loose;

		const pointer = around?.pointer;
		if (pointer) {
			const px = s.x - pointer.x;
			const py = s.y + pointer.y;
			const reach = Math.hypot(px, py);
			if (reach < 130) {
				const fright = 1 - reach / 130;
				ax += (px / (reach || 1)) * 260 * fright;
				climb += (py / (reach || 1)) * 200 * fright;
				az += 60 * fright;
				s.spook = Math.max(s.spook, fright);
			}
		}
		s.spook = ease(s.spook, 0, 2.5, dt);

		const bounds = around?.bounds;
		if (bounds) {
			if (s.x < bounds.left + 28) ax += (bounds.left + 28 - s.x) * 8;
			if (s.x > bounds.right - 28) ax -= (s.x - bounds.right + 28) * 8;
		}

		s.jinkIn -= dt;
		if (s.jinkIn <= 0) jink();
		s.swayIn -= dt;
		if (s.swayIn <= 0) swerve();
		s.kick = ease(s.kick, 0, 3.2, dt);

		// With nothing much to aim at (it is over the spot already, just too high
		// or too low) it keeps whatever heading it has and lets the wander turn it.
		const pull = smooth(Math.hypot(ax, az) / 70);
		const wander = (rad(10) + rad(26) * far) * noise.turn(s.time) + s.kick;
		const aim = s.yaw + wrap(Math.atan2(az, ax) - s.yaw) * pull + wander;
		const turn = clamp(wrap(aim - s.yaw) * TURN_GAIN, -TURN_MAX, TURN_MAX);
		s.yawRate = ease(s.yawRate, turn, 20, dt);
		s.yaw = wrap(s.yaw + s.yawRate * dt);

		s.dart = ease(s.dart, 0, 4, dt);
		let cruise =
			CRUISE *
			(0.85 + 0.3 * noise.speed(s.time) + s.dart) *
			(passing ? 1 : lerp(0.5, 1, smooth(distance / 150))) *
			s.haste *
			(fleeing ? 1.6 : 1);

		// Beat, beat, beat, glide.
		const calm = !fleeing && s.spook < 0.2;
		const speed = Math.hypot(s.vx, s.vz);
		if (s.gliding) {
			s.glideLeft -= dt;
			climb -= 55;
			const sinking = dy > 26 && s.vy < -30;
			if (s.glideLeft <= 0 || !calm || sinking || (!via && distance < 110) || speed < 70) {
				s.gliding = false;
				s.beatsLeft = Math.round(between(3, 7));
				resumeBeat(s.held);
			}
		} else {
			climb += 20;
		}

		const demand = clamp((climb - s.vy) / 260, -1, 1);
		const effort = clamp(
			0.4 + 0.5 * Math.max(0, climb / CLIMB) + 0.35 * demand + (fleeing ? 0.6 : 0) + 0.4 * s.spook,
			0.15,
			1.3
		);
		s.freq = ease(s.freq, 6.2 + 3 * effort, 9, dt);
		s.amp = ease(s.amp, rad(36 + 17 * effort), 9, dt);
		s.mean = ease(s.mean, rad(20 + 2 * effort), 9, dt);
		s.hold = ease(s.hold, s.gliding ? 1 : 0, s.gliding ? 22 : 40, dt);
		if (s.gliding) s.held = ease(s.held, DIHEDRAL + rad(3) * noise.roll(s.time), 10, dt);

		const beating = 1 - s.hold;
		const before = s.phase;
		s.phase += TAU * s.freq * s.tempo * dt * beating;
		if (Math.floor(s.phase / TAU) > Math.floor(before / TAU)) {
			// Top of a beat: a good moment to decide to stop beating for a bit.
			s.beat = between(0.6, 1.4);
			s.tempo = between(0.86, 1.12);
			s.beatsLeft -= 1;
			const room = (via || distance > 150) && s.z > 26 && speed > 100 && climb < 70;
			if (s.beatsLeft <= 0 && calm && room && random() < 0.9) {
				s.gliding = true;
				s.glideLeft = between(0.25, 0.7);
				s.held = beatAngle(0, s.amp);
			}
		}
		if (s.gliding) cruise *= 0.9;

		// Lift comes on the downstroke, thrust on the upstroke.
		const at = stroke(s.phase);
		const strength = s.amp / FULL_BEAT;
		const drag = lerp(DRAG, DRAG_GLIDING, s.hold);
		const thrust = DRAG * cruise * (1 - 0.85 * Math.sin(at)) * beating;
		// Fresh off the page it is still upright, back to the reader, and what its
		// wings push against is the page: for those first beats it comes straight out.
		const level = 1 - s.blend;
		s.vx += (Math.cos(s.yaw) * level * thrust - drag * s.vx) * dt;
		s.vz += ((Math.sin(s.yaw) * level + s.blend) * thrust - drag * DEPTH_DRAG * s.vz) * dt;
		s.vy += clamp((climb - s.vy) * lerp(7, 3, s.hold), -1100, 1100) * dt;
		bounce(dt, strength * s.beat * beating, at, 1);
		// It keeps to a band in front of the page.
		if (s.z > DEPTH_LIMIT) s.vz -= (s.z - DEPTH_LIMIT) * 160 * dt;

		s.x += s.vx * dt;
		s.y += s.vy * dt;
		s.z += s.vz * dt;
		if (s.z < 6) {
			s.z = 6;
			s.vz = Math.abs(s.vz) * 0.4;
		}

		// It flies nose-up, more so the slower it goes, and nods with every beat.
		const nose = rad(46) - rad(27) * clamp(speed / 260, 0, 1) + clamp(s.vy / 220, -1, 1) * rad(17);
		s.pitchBase = ease(s.pitchBase, lerp(nose, rad(9), s.hold), 12, dt);
		s.pitch = s.pitchBase + rad(8) * strength * Math.sin(at + 0.9) * beating;
		s.roll = ease(
			s.roll,
			clamp(-s.yawRate * 0.085, -0.62, 0.62) + rad(7) * noise.roll(s.time),
			14,
			dt
		);
		s.lean = clamp(s.yawRate / TURN_MAX, -1, 1);
		s.blend = Math.max(0, s.blend - dt / 0.3);

		if (!passing && distance < LANDING_RANGE) {
			s.mode = 'landing';
			s.since = 0;
			s.gliding = false;
		}
	}

	// ---------------------------------------------------------------- landing

	function land(dt) {
		const dx = s.target.x - s.x;
		const dy = -s.target.y - s.y;
		const dz = -s.z;
		const distance = Math.hypot(dx, dy, dz);

		// Reeled in, gently at first and then firmly.
		const pull = lerp(6.5, 12, smooth(s.since / 0.55));
		const at = stroke(s.phase);
		const strength = s.amp / FULL_BEAT;
		const flutter = smooth(distance / 30);
		s.vx += (pull * pull * dx - 1.8 * pull * s.vx) * dt;
		s.vy += (pull * pull * dy - 1.8 * pull * s.vy) * dt;
		s.vz += (pull * pull * dz - 1.8 * pull * s.vz) * dt;
		// The bouncing dies away as it gets its feet down.
		bounce(dt, 0.6 * strength * flutter, at, lerp(5, 1, flutter));
		s.x += s.vx * dt;
		s.y += s.vy * dt;
		s.z = Math.max(0, s.z + s.vz * dt);

		// Quick, shallow beats with the wings held high: the hovering flutter.
		s.freq = ease(s.freq, 9.5, 8, dt);
		s.amp = ease(s.amp, rad(lerp(22, 33, flutter)), 8, dt);
		s.mean = ease(s.mean, rad(lerp(24, 34, flutter)), 8, dt);
		s.hold = ease(s.hold, 0, 40, dt);
		s.tempo = 1;
		s.phase += TAU * s.freq * dt;

		// Turn to face the page and rear up.
		const turn = clamp(wrap(INTO_PAGE - s.yaw) * 9, -10, 10);
		s.yawRate = ease(s.yawRate, turn, 20, dt);
		s.yaw = wrap(s.yaw + s.yawRate * dt);
		s.pitchBase = ease(s.pitchBase, rad(78), 9, dt);
		s.pitch = s.pitchBase + rad(5) * strength * Math.sin(at + 0.9);
		s.roll = ease(s.roll, 0, 10, dt);
		s.lean = 0;
		s.tilt = ease(s.tilt, s.target.tilt ?? 0, 12, dt);
		s.blend = Math.max(s.blend, smooth(1 - distance / 46));

		const speed = Math.hypot(s.vx, s.vy, s.vz);
		if ((distance < 1.5 && speed < 45) || s.since > 1.7) touchDown();
	}

	function touchDown() {
		const at = stroke(s.phase);
		s.held = beatAngle(0, s.amp);
		s.heldSpeed = -s.amp * Math.sin(at) * TAU * s.freq * 0.5;
		s.hold = 1;
		s.mode = 'perched';
		s.since = 0;
		s.x = s.target.x;
		s.y = -s.target.y;
		s.z = 0;
		s.vx = s.vy = s.vz = 0;
		s.bob = s.bobSpeed = 0;
		s.blend = 1;
		s.tilt = s.target.tilt ?? 0;
		s.tiltGoal = s.tilt;
		s.turnIn = between(7, 18);
		s.flick = 0;
		s.lean = 0;
		s.settle = 0.7;
		s.wary = 0;
		s.fan = null;
		s.fans = random() < 0.5 ? 2 : 1;
		s.fanIn = between(0.7, 1.3);
	}

	function advance(dt, around) {
		s.time += dt;
		s.since += dt;
		if (s.mode === 'perched') sit(dt);
		else if (s.mode === 'windup') windup(dt);
		else if (s.mode === 'flying') fly(dt, around);
		else land(dt);
	}

	function wing(side) {
		const amp = s.amp * (1 - side * s.lean * 0.16);
		const at = (lag) => lerp(beatAngle(lag, amp), s.held, s.hold);
		return {
			root: at(0),
			tip: at(TIP_LAG),
			rootTrail: at(TRAIL_LAG),
			tipTrail: at(TIP_LAG + TRAIL_LAG),
			sweep:
				-SWEEP * (amp / FULL_BEAT) * Math.cos(stroke(s.phase - 0.05 * TAU)) * (1 - s.hold) +
				rad(2) * s.hold
		};
	}

	return {
		get mode() {
			return s.mode;
		},
		/** True while it is sitting perfectly still, so nothing needs drawing. */
		get still() {
			return (
				s.mode === 'perched' &&
				!s.fan &&
				s.settle <= 0 &&
				s.flick <= 0 &&
				Math.abs(s.tilt - s.tiltGoal) < 0.004 &&
				Math.abs(s.held - lerp(REST, POISED, s.wary > 0.02 ? s.wary : 0)) < 0.002 &&
				Math.abs(s.heldSpeed) < 0.01
			);
		},
		/** Seconds until it next does something of its own accord while sitting. */
		get nextStir() {
			return Math.max(0, Math.min(s.fanIn, s.turnIn));
		},
		get target() {
			return s.target;
		},

		/**
		 * Sit it down on a spot, no flight. Leave `tilt` out to keep the way it is facing.
		 *
		 * @param {Spot} spot
		 */
		perch(spot) {
			s.mode = 'perched';
			if (spot.tilt !== undefined) s.tilt = s.tiltGoal = spot.tilt;
			s.target = { x: spot.x, y: spot.y, tilt: s.tilt };
			s.x = spot.x;
			s.y = -spot.y;
			s.z = 0;
			s.vx = s.vy = s.vz = 0;
			s.bob = s.bobSpeed = 0;
			s.blend = 1;
			s.hold = 1;
			s.lean = 0;
		},

		/** How nervous it is about the cursor, 0 to 1. Only matters while it sits. */
		setWary(level) {
			s.wary = clamp(level, 0, 1);
		},

		/**
		 * Take off for another spot. With `from` (a page point) it bolts away
		 * from there first; without, it leaves in its own time.
		 *
		 * @param {Spot} spot
		 * @param {{x: number, y: number} | null} [from]
		 * @param {{x: number, y: number}[]} [via] - Page points to wander past on the way.
		 */
		flyTo(spot, from = null, via = []) {
			if (s.mode === 'flying' || s.mode === 'landing') {
				s.target = spot;
				return;
			}
			s.via = [...via];
			let away = [between(-0.5, 0.5), 1];
			if (from) {
				const dx = s.x - from.x;
				const dy = s.y + from.y;
				const length = Math.hypot(dx, dy) || 1;
				// Away from whatever it was, and up: butterflies go up.
				away = [dx / length, dy / length + 0.7];
			}
			const length = Math.hypot(away[0], away[1]) || 1;
			s.fleeDir = [away[0] / length, away[1] / length];
			s.flee = from ? between(0.42, 0.72) : between(0.22, 0.36);
			s.haste = clamp(Math.hypot(spot.x - s.x, -spot.y - s.y) / 420, 1, 1.9);
			s.target = spot;
			s.mode = 'windup';
			s.since = 0;
		},

		/** The spot it is making for has moved a little; keep making for it. @param {Spot} spot */
		follow(spot) {
			s.target = spot;
		},

		/** Change where it is going mid-flight (the spot got crowded). @param {Spot} spot */
		retarget(spot) {
			s.target = spot;
			s.via = [];
			if (s.mode === 'landing') {
				s.mode = 'flying';
				s.since = 0;
			}
		},

		/**
		 * Put it in the air somewhere (off-screen, say) already on its way to a spot.
		 *
		 * @param {{x: number, y: number}} from
		 * @param {Spot} spot
		 */
		arrive(from, spot) {
			s.via = [];
			s.mode = 'flying';
			s.since = 0;
			s.target = spot;
			s.x = from.x;
			s.y = -from.y;
			s.z = CRUISE_DEPTH + 20;
			const dx = spot.x - from.x;
			const dy = -spot.y + from.y;
			const length = Math.hypot(dx, dy) || 1;
			s.yaw = dx >= 0 ? rad(15) : rad(165);
			s.yawRate = 0;
			s.vx = (dx / length) * CRUISE;
			s.vy = (dy / length) * CRUISE * 0.6;
			s.vz = 0;
			s.bob = s.bobSpeed = 0;
			s.pitchBase = rad(28);
			s.pitch = s.pitchBase;
			s.roll = 0;
			s.blend = 0;
			s.hold = 0;
			s.flee = 0;
			s.haste = clamp(length / 420, 1, 1.9);
			s.freq = 8;
			s.amp = rad(45);
			s.mean = rad(21);
			s.phase = random() * TAU;
			s.gliding = false;
			s.beatsLeft = Math.round(between(4, 8));
			s.jinkIn = between(0.3, 0.7);
			s.kick = 0;
			s.dart = 0;
			s.sway = between(-1, 1);
			s.swayIn = between(0.4, 1);
			s.heave = 0;
			s.spook = 0;
			s.wary = 0;
			s.fan = null;
		},

		/**
		 * @param {number} dt - Seconds since the last step.
		 * @param {Surroundings} [around]
		 */
		step(dt, around) {
			let left = Math.min(dt, 0.1);
			while (left > 1e-6) {
				const slice = Math.min(left, 1 / 120);
				advance(slice, around);
				left -= slice;
			}
		},

		/** Let time pass while nothing is being drawn (it is asleep on its perch). */
		doze(seconds) {
			if (s.mode !== 'perched' || s.fan) return;
			s.fanIn -= seconds;
			s.turnIn -= seconds;
		},

		/** Where it is and how it is holding itself, ready for the renderer. */
		pose() {
			const flying = flightFrame(s.yaw, s.pitch, s.roll);
			const basis = mixFrames(flying, sittingFrame(s.tilt), s.blend);
			return {
				x: s.x,
				y: -(s.y + s.bob),
				height: s.z,
				zoom: 1 + s.z / DEPTH_OF_FIELD,
				basis,
				left: wing(-1),
				right: wing(1)
			};
		}
	};
}
