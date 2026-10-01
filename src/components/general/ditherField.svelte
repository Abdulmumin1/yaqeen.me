<script>
	import { onMount } from 'svelte';

	/**
	 * A slowly drifting ordered-dither field that fills its parent. It is drawn one
	 * canvas pixel per `cell` and scaled up with nearest-neighbour, so every dot
	 * stays a crisp square. Changing `pattern` or `ramp` repaints at once.
	 *
	 * @typedef {Object} Props
	 * @property {'clouds' | 'bands' | 'bars' | 'waves' | 'rings'} [pattern]
	 * @property {string[]} ramp - Hex colours, lowest value first.
	 * @property {number} [cell] - CSS pixels per dither cell.
	 * @property {2 | 4} [matrix] - Bayer matrix size.
	 * @property {number} [seed]
	 */

	/** @type {Props} */
	let { pattern = 'clouds', ramp, cell = 6, matrix = 4, seed = 1 } = $props();

	const FRAME_INTERVAL = 1000 / 20;
	const BAYER = {
		2: [0, 2, 3, 1],
		4: [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
	};

	let canvas = $state(null);
	let cols = 0;
	let rows = 0;
	let context = null;
	let image = null;
	let pixels = null;
	let still = false;

	const look = $derived({
		thresholds: BAYER[matrix].map((value) => (value + 0.5) / (matrix * matrix)),
		// Canvas pixels are written as little-endian ABGR words.
		colors: ramp.map((hex) => {
			const value = parseInt(hex.slice(1), 16);
			return (255 << 24) | ((value & 0xff) << 16) | (value & 0xff00) | (value >> 16);
		})
	});

	const clamp01 = (value) => (value < 0 ? 0 : value > 1 ? 1 : value);

	function hash(ix, iy, salt) {
		let h = Math.imul(ix, 0x27d4eb2d) ^ Math.imul(iy, 0x165667b1) ^ Math.imul(salt, 0x9e3779b1);
		h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
		h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
		return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
	}

	function noise(x, y, salt) {
		const ix = Math.floor(x);
		const iy = Math.floor(y);
		const fx = x - ix;
		const fy = y - iy;
		const sx = fx * fx * (3 - 2 * fx);
		const sy = fy * fy * (3 - 2 * fy);
		const a = hash(ix, iy, salt);
		const b = hash(ix + 1, iy, salt);
		const c = hash(ix, iy + 1, salt);
		const d = hash(ix + 1, iy + 1, salt);
		return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
	}

	function fbm(x, y, salt) {
		return (
			0.55 * noise(x, y, salt) +
			0.3 * noise(x * 2.1 + 7.3, y * 2.1 + 1.7, salt) +
			0.15 * noise(x * 4.3 + 2.9, y * 4.3 + 9.1, salt)
		);
	}

	// Each pattern maps a point to 0..1. `x` runs 0..aspect, `y` runs 0..1, `t` is seconds.
	const patterns = {
		// Drifting blobs.
		clouds(x, y, t) {
			const value =
				0.62 * fbm(x * 2.4 + t * 0.045, y * 2.4 - t * 0.02, seed) +
				0.38 * fbm(x * 1.2 - t * 0.03 + 40, y * 1.2 + t * 0.035 + 40, seed + 7);
			const stretched = clamp01((value - 0.28) / 0.44);
			return stretched * stretched * (3 - 2 * stretched);
		},
		// Horizontal stripes that step through the ramp, gently rippling.
		bands(x, y, t) {
			return y + 0.045 * Math.sin(x * 2.6 + t * 0.4) + 0.022 * Math.sin(x * 6.3 - t * 0.27 + seed);
		},
		// A bar chart that keeps re-measuring itself.
		bars(x, y, t, aspect) {
			const count = Math.max(5, Math.round(aspect * 8));
			const position = (x / aspect) * count;
			const column = Math.floor(position);
			const within = position - column;
			if (within < 0.16 || within > 0.84) return 0;
			const trend = column / (count - 1);
			const height = clamp01(
				0.16 + 0.42 * trend + 0.4 * noise(column * 0.61 + seed, t * 0.07, seed)
			);
			const top = 1 - height;
			return y < top ? 0 : 0.34 + 0.52 * ((y - top) / height);
		},
		// Three overlapping swells along the bottom.
		waves(x, y, t) {
			let level = 0;
			for (let layer = 0; layer < 3; layer += 1) {
				const crest =
					0.42 +
					layer * 0.17 +
					0.055 *
						Math.sin(x * (1.6 + layer * 0.5) + t * (0.35 + layer * 0.12) + layer * 2.1 + seed) +
					0.03 * Math.sin(x * (3.7 - layer * 0.6) - t * 0.2 + layer);
				level += clamp01((y - crest) / 0.05 + 0.5);
			}
			return level * 0.25;
		},
		// Rings radiating from below the bottom edge.
		rings(x, y, t, aspect) {
			const distance = Math.hypot(x - aspect * 0.5, y - 1.3);
			const wave = 0.5 + 0.5 * Math.sin(distance * 24 - t * 0.9);
			return wave * clamp01(1.35 - distance * 0.8) * 0.74;
		}
	};

	function draw(now) {
		if (!context || !cols || !rows) return;
		const { colors, thresholds } = look;
		const field = patterns[pattern];
		const limit = colors.length - 1;
		const aspect = cols / rows;
		const t = still ? 12 : now / 1000;

		for (let row = 0; row < rows; row += 1) {
			const y = (row + 0.5) / rows;
			const offset = row * cols;
			const thresholdRow = (row % matrix) * matrix;
			for (let col = 0; col < cols; col += 1) {
				const x = ((col + 0.5) / cols) * aspect;
				const level = clamp01(field(x, y, t, aspect)) * limit;
				const base = level | 0;
				const step = level - base > thresholds[thresholdRow + (col % matrix)] ? 1 : 0;
				pixels[offset + col] = colors[Math.min(base + step, limit)];
			}
		}
		context.putImageData(image, 0, 0);
	}

	// A new pattern or palette shows up on the very next paint, not the next tick.
	$effect(() => {
		draw(performance.now());
	});

	onMount(() => {
		const host = canvas.parentElement;
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		still = reducedMotion.matches;
		context = canvas.getContext('2d');

		let frame = 0;
		let lastPaint = 0;
		let visible = false;

		function resize() {
			// Layout size, not the bounding box: the host may be mid-transform (tilted, scaled).
			cols = Math.max(1, Math.ceil(host.clientWidth / cell));
			rows = Math.max(1, Math.ceil(host.clientHeight / cell));
			canvas.width = cols;
			canvas.height = rows;
			// Whole multiples of `cell`, so no column is ever stretched by a stray pixel.
			canvas.style.width = `${cols * cell}px`;
			canvas.style.height = `${rows * cell}px`;
			image = context.createImageData(cols, rows);
			pixels = new Uint32Array(image.data.buffer);
			draw(performance.now());
		}

		function tick(now) {
			frame = 0;
			if (!visible || still) return;
			if (now - lastPaint >= FRAME_INTERVAL) {
				lastPaint = now;
				draw(now);
			}
			frame = requestAnimationFrame(tick);
		}

		function wake() {
			if (!frame && visible && !still) frame = requestAnimationFrame(tick);
		}

		function onMotionPreference() {
			still = reducedMotion.matches;
			if (still) draw(performance.now());
			else wake();
		}

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(host);

		const visibilityObserver = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			wake();
		});
		visibilityObserver.observe(canvas);

		reducedMotion.addEventListener('change', onMotionPreference);

		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			visibilityObserver.disconnect();
			reducedMotion.removeEventListener('change', onMotionPreference);
		};
	});
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		display: block;
		image-rendering: pixelated;
		pointer-events: none;
	}
</style>
