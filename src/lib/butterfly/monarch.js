// The monarch as a tiny 3D model, drawn with WebGL.
//
// Everything is cut from one photo of a monarch seen from above
// (static/butterfly/monarch.png → monarch-atlas.webp, see
// scripts/cut-butterfly.mjs). Each wing is a small grid that hinges on the
// thorax and bends along its span, so a wingbeat travels out to the tip the way
// it does on the real thing. The body is two crossed cards and the antennae
// stand up in a shallow V, so there is something to look at from every side.
//
// Measurements below are in pixels of the source photo (1536 x 1024). The body
// frame is: `r` out along the right wing, `f` towards the head, `u` out of the
// animal's back. World space is x right, y up, z towards the viewer.

import { ATLAS, AXIS, SOURCE } from './atlas.js';

export const SOURCE_WIDTH = SOURCE.width;

const ROOT = 470; // middle of the thorax: the model's origin
const HINGE = 28; // the wings hinge this far either side of the centre line
const WING = { tip: 1378, top: 106, bottom: 878 }; // right wing; the left one mirrors it
const SPAN = WING.tip - AXIS - HINGE;
const LEAD = 300; // a beat reaches the leading edge first...
const TRAIL = 800; // ...and the trailing edge of the hindwing last
const BODY = { half: 46, top: 352, bottom: 808, depth: 0.8, sink: 12 };
const ANTENNA = { reach: 150, top: 140, bottom: 362, lift: 0.5 };

// A point in the photo, as a place in the atlas's wings layer or its body layer.
const wingsUV = (x, y) => [
	(ATLAS.wings.x + (x * ATLAS.wings.width) / SOURCE.width) / ATLAS.size,
	(ATLAS.wings.y + (y * ATLAS.wings.height) / SOURCE.height) / ATLAS.size
];
const bodyUV = (x, y) => {
	const { from } = ATLAS.body;
	return [
		(ATLAS.body.x + ((x - from.left) * ATLAS.body.width) / from.width) / ATLAS.size,
		(ATLAS.body.y + ((y - from.top) * ATLAS.body.height) / from.height) / ATLAS.size
	];
};

const SPAN_STEPS = 12;
const CHORD_STEPS = 10;
const CAMERA = 5200; // how far the eye is from the butterfly, for a little perspective
const LIGHT = [-0.2425, 0.4244, 0.8724]; // over the reader's left shoulder
const FLOATS = 6; // x, y, u, v, light, facing

const VERTEX = `
attribute vec2 a_position;
attribute vec2 a_uv;
attribute vec2 a_shade;
varying vec2 v_uv;
varying vec2 v_shade;
void main() {
	v_uv = a_uv;
	v_shade = a_shade;
	gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAGMENT = `
precision mediump float;
uniform sampler2D u_atlas;
uniform float u_shadow;
varying vec2 v_uv;
varying vec2 v_shade;
void main() {
	// Sampled a little sharper than the GPU would choose: the canvas is drawn
	// oversized and scaled down, which is where the smoothing comes from.
	vec4 texel = texture2D(u_atlas, v_uv, -1.5);
	if (u_shadow > 0.5) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, texel.a);
		return;
	}
	// The underside of a monarch's wing carries the same pattern, only paler.
	float under = smoothstep(0.04, -0.04, v_shade.y);
	vec3 pale = texel.rgb * vec3(0.9, 0.88, 0.8) + texel.a * vec3(0.16, 0.12, 0.06);
	vec3 lit = mix(texel.rgb, pale, under) * v_shade.x;
	gl_FragColor = vec4(min(lit, vec3(texel.a)), texel.a);
}`;

const clamp01 = (value) => Math.min(Math.max(value, 0), 1);

/** The parts of a wing that never change: where each grid point is in the photo. */
function wingGrid(side) {
	const columns = SPAN_STEPS + 1;
	const rows = CHORD_STEPS + 1;
	const uv = new Float32Array(columns * rows * 2);
	const forward = new Float32Array(rows);
	const chord = new Float32Array(rows);

	for (let j = 0; j < rows; j += 1) {
		const y = WING.top + ((WING.bottom - WING.top) * j) / CHORD_STEPS;
		forward[j] = ROOT - y;
		chord[j] = clamp01((y - LEAD) / (TRAIL - LEAD));
		for (let i = 0; i < columns; i += 1) {
			const x = AXIS + side * (HINGE + (SPAN * i) / SPAN_STEPS);
			uv.set(wingsUV(x, y), (j * columns + i) * 2);
		}
	}

	const indices = [];
	for (let j = 0; j < CHORD_STEPS; j += 1) {
		for (let i = 0; i < SPAN_STEPS; i += 1) {
			const a = j * columns + i;
			indices.push(a, a + 1, a + columns, a + 1, a + columns + 1, a + columns);
		}
	}
	return { side, uv, forward, chord, indices, count: columns * rows };
}

/** A flat card in the body frame: four corners as [r, f, u] with their place in the photo. */
function card(corners) {
	return corners.map(([r, f, u, x, y]) => ({ r, f, u, uv: bodyUV(x, y) }));
}

function bodyCards() {
	const top = ROOT - BODY.top;
	const bottom = ROOT - BODY.bottom;
	const left = AXIS - BODY.half;
	const right = AXIS + BODY.half;
	const deep = BODY.half * BODY.depth;
	const reach = ANTENNA.reach;
	const out = reach * Math.cos(ANTENNA.lift);
	const up = reach * Math.sin(ANTENNA.lift);
	const tip = ROOT - ANTENNA.top;
	const base = ROOT - ANTENNA.bottom;

	return [
		// Seen from the side: the same strip of photo, stood on edge.
		card([
			[0, top, deep - BODY.sink, left, BODY.top],
			[0, top, -deep - BODY.sink, right, BODY.top],
			[0, bottom, deep - BODY.sink, left, BODY.bottom],
			[0, bottom, -deep - BODY.sink, right, BODY.bottom]
		]),
		// Seen from above.
		card([
			[-BODY.half, top, 0, left, BODY.top],
			[BODY.half, top, 0, right, BODY.top],
			[-BODY.half, bottom, 0, left, BODY.bottom],
			[BODY.half, bottom, 0, right, BODY.bottom]
		]),
		// Antennae, each lifted off the back a little.
		card([
			[-out, tip, up, AXIS - reach, ANTENNA.top],
			[0, tip, 0, AXIS, ANTENNA.top],
			[-out, base, up, AXIS - reach, ANTENNA.bottom],
			[0, base, 0, AXIS, ANTENNA.bottom]
		]),
		card([
			[0, tip, 0, AXIS, ANTENNA.top],
			[out, tip, up, AXIS + reach, ANTENNA.top],
			[0, base, 0, AXIS, ANTENNA.bottom],
			[out, base, up, AXIS + reach, ANTENNA.bottom]
		])
	];
}

/**
 * @typedef {Object} WingPose  Angles in radians, 0 is flat out to the side, positive is up over the back.
 * @property {number} root       - Leading edge, at the hinge.
 * @property {number} tip        - Leading edge, at the wing tip.
 * @property {number} rootTrail  - Trailing edge, at the hinge.
 * @property {number} tipTrail   - Trailing edge, at the wing tip.
 * @property {number} sweep      - How far the forewing is pulled forward.
 *
 * @typedef {Object} Pose
 * @property {number[]} basis - The body frame in world space: [...r, ...f, ...u].
 * @property {number} scale   - CSS pixels per pixel of the source photo.
 * @property {WingPose} left
 * @property {WingPose} right
 */

/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLImageElement | ImageBitmap} atlas
 */
export function createMonarch(canvas, atlas) {
	const options = { alpha: true, antialias: false, depth: false, stencil: false };
	const gl =
		canvas.getContext('webgl', options) ?? canvas.getContext('experimental-webgl', options);
	if (!gl) return null;

	const wings = [wingGrid(1), wingGrid(-1)];
	const cards = bodyCards();
	const bodyCount = cards.length * 4;
	const vertexCount = wings[0].count + wings[1].count + bodyCount;
	const vertices = new Float32Array(vertexCount * FLOATS);

	// One index list: right wing, left wing, body.
	const indices = [];
	const ranges = [];
	let firstVertex = 0;
	for (const wing of wings) {
		ranges.push({ first: indices.length, count: wing.indices.length, firstVertex });
		for (const index of wing.indices) indices.push(index + firstVertex);
		firstVertex += wing.count;
	}
	ranges.push({ first: indices.length, count: cards.length * 6, firstVertex });
	cards.forEach((_, n) => {
		const a = firstVertex + n * 4;
		indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
	});

	let program = null;
	let size = 1; // CSS pixels across the canvas

	function compile(type, source) {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		return shader;
	}

	function setup() {
		program = gl.createProgram();
		gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
		gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
		gl.useProgram(program);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength, gl.DYNAMIC_DRAW);

		const stride = FLOATS * 4;
		[
			['a_position', 2, 0],
			['a_uv', 2, 8],
			['a_shade', 2, 16]
		].forEach(([name, length, offset]) => {
			const location = gl.getAttribLocation(program, name);
			gl.enableVertexAttribArray(location);
			gl.vertexAttribPointer(location, length, gl.FLOAT, false, stride, offset);
		});

		gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		// Wings seen nearly edge-on stay crisp along their length.
		const sharp = gl.getExtension('EXT_texture_filter_anisotropic');
		if (sharp) gl.texParameterf(gl.TEXTURE_2D, sharp.TEXTURE_MAX_ANISOTROPY_EXT, 4);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.clearColor(0, 0, 0, 0);
		return true;
	}

	if (!setup()) return null;

	let lost = false;
	const onLost = (event) => {
		event.preventDefault();
		lost = true;
	};
	const onRestored = () => {
		lost = !setup();
	};
	canvas.addEventListener('webglcontextlost', onLost);
	canvas.addEventListener('webglcontextrestored', onRestored);

	/**
	 * Fill the vertex buffer for one pass and return each part's depth.
	 * `shadow` flattens everything onto the page along the light instead.
	 */
	function build(pose, scale, shadow) {
		const [rx, ry, rz, fx, fy, fz, ux, uy, uz] = pose.basis;
		const toClip = (2 * scale) / size;
		const depths = [];
		let v = 0;

		const put = (r, f, u, uvU, uvV, light, facing) => {
			let x = r * rx + f * fx + u * ux;
			let y = r * ry + f * fy + u * uy;
			const z = r * rz + f * fz + u * uz;
			if (shadow) {
				x -= (LIGHT[0] / LIGHT[2]) * z;
				y -= (LIGHT[1] / LIGHT[2]) * z;
			} else {
				const near = CAMERA / (CAMERA - z);
				x *= near;
				y *= near;
			}
			vertices[v] = x * toClip;
			vertices[v + 1] = y * toClip;
			vertices[v + 2] = uvU;
			vertices[v + 3] = uvV;
			vertices[v + 4] = light;
			vertices[v + 5] = facing;
			v += FLOATS;
			return z;
		};

		const step = SPAN / SPAN_STEPS;
		for (const wing of wings) {
			const { side, uv, forward, chord } = wing;
			const angles = side > 0 ? pose.right : pose.left;
			const pull = Math.tan(angles.sweep);
			let depth = 0;

			for (let j = 0; j <= CHORD_STEPS; j += 1) {
				const late = chord[j];
				const atRoot = angles.root + (angles.rootTrail - angles.root) * late;
				const atTip = angles.tip + (angles.tipTrail - angles.tip) * late;
				let along = 0;
				let lift = 0;
				let previous = atRoot;

				for (let i = 0; i <= SPAN_STEPS; i += 1) {
					// The wing is stiff at the root and gives more towards the tip.
					const angle = atRoot + (atTip - atRoot) * Math.pow(i / SPAN_STEPS, 1.6);
					if (i > 0) {
						const mid = (angle + previous) / 2;
						along += step * Math.cos(mid);
						lift += step * Math.sin(mid);
					}
					previous = angle;

					// The surface normal, in world space, for shading and for knowing which face shows.
					const nr = -side * Math.sin(angle);
					const nu = Math.cos(angle);
					const nx = nr * rx + nu * ux;
					const ny = nr * ry + nu * uy;
					const nz = nr * rz + nu * uz;
					const flip = nz >= 0 ? 1 : -1;
					const lambert = flip * (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]);
					// Wings are thin: turned away from the light they glow rather than go dark.
					const light =
						lambert >= 0 ? 1 + 0.3 * (lambert - LIGHT[2]) : 1 - 0.3 * LIGHT[2] - 0.2 * lambert;

					const k = (j * (SPAN_STEPS + 1) + i) * 2;
					const z = put(
						side * (HINGE + along),
						forward[j] + i * step * pull * (1 - 0.85 * late),
						lift,
						uv[k],
						uv[k + 1],
						light,
						nz
					);
					depth += z;
				}
			}
			depths.push(depth / wing.count);
		}

		for (const corners of cards) {
			for (const corner of corners)
				put(corner.r, corner.f, corner.u, corner.uv[0], corner.uv[1], 1, 1);
		}
		depths.push(0);
		return depths;
	}

	function paint(depths, shadow) {
		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
		gl.uniform1f(gl.getUniformLocation(program, 'u_shadow'), shadow ? 1 : 0);
		// Furthest part first.
		const order = [0, 1, 2].sort((a, b) => depths[a] - depths[b]);
		for (const part of order) {
			const { first, count } = ranges[part];
			gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, first * 2);
		}
	}

	return {
		/**
		 * @param {number} cssSize - Width of the (square) canvas in CSS pixels.
		 * @param {number} density - Backing pixels per CSS pixel.
		 */
		resize(cssSize, density) {
			size = cssSize;
			const pixels = Math.round(cssSize * density);
			if (canvas.width !== pixels) {
				canvas.width = pixels;
				canvas.height = pixels;
			}
		},

		/** @param {Pose} pose */
		draw(pose) {
			if (lost) return;
			paint(build(pose, pose.scale, false), false);
		},

		/**
		 * The butterfly's shadow on the page, drawn into another (2D) canvas so it
		 * can be blurred and placed on its own. `scale` is the size it has on the page.
		 *
		 * @param {CanvasRenderingContext2D} target
		 * @param {Pose} pose
		 * @param {number} scale
		 */
		drawShadow(target, pose, scale) {
			if (lost) return;
			paint(build(pose, scale, true), true);
			const { width, height } = target.canvas;
			target.clearRect(0, 0, width, height);
			target.drawImage(canvas, 0, 0, width, height);
		},

		destroy() {
			canvas.removeEventListener('webglcontextlost', onLost);
			canvas.removeEventListener('webglcontextrestored', onRestored);
			gl.getExtension('WEBGL_lose_context')?.loseContext();
		}
	};
}

/** How far the shadow falls from the butterfly, in page pixels per pixel of height off the page. */
export const SHADOW_DRIFT = [-LIGHT[0] / LIGHT[2], LIGHT[1] / LIGHT[2]];
