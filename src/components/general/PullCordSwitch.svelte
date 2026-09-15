<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';
	import { darkMode } from '$lib/utils/darkmode.js';

	/**
	 * @typedef {Object} Props
	 * @property {string} [class] - Optional additional CSS classes.
	 */

	/** @type {Props} */
	let { class: className = '' } = $props();

	// Reactive physics & interaction state
	let isMounted = $state(false);
	let isHovered = $state(false);
	let isDragging = $state(false);

	let x = $state(0);
	let y = $state(0);

	let isAnimating = false;
	let currentAnimFrame = null;

	// Derived values for geometry and spring transform
	let rotate = $derived((180 * Math.atan2(x || 0, Math.max(88 + (y || 0), 10))) / Math.PI);
	let scaleX = $derived(y < 0 ? 1 - (y / 20) * 0.06 : 1 - Math.min(y / 110, 1) * 0.06);
	let scaleY = $derived(y < 0 ? 1 + (y / 20) * 0.08 : 1 + Math.min(y / 110, 1) * 0.12);

	// High-fidelity mechanical switch click sound (dual-transient pawl + contact strike + body resonance)
	function playClick(isDark) {
		try {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			if (!AudioCtx) return;
			const ctx = new AudioCtx();
			if (ctx.state === 'suspended') ctx.resume();
			const now = ctx.currentTime;

			// Master bus to maintain clean, pleasant dynamics
			const master = ctx.createGain();
			master.gain.setValueAtTime(0.35, now);
			master.connect(ctx.destination);

			// 1. Initial micro-transient (pawl/latch trip, 0-8ms)
			const oscLatch = ctx.createOscillator();
			const gainLatch = ctx.createGain();
			oscLatch.type = 'triangle';
			oscLatch.frequency.setValueAtTime(isDark ? 2800 : 3400, now);
			oscLatch.frequency.exponentialRampToValueAtTime(700, now + 0.007);
			gainLatch.gain.setValueAtTime(0.22, now);
			gainLatch.gain.exponentialRampToValueAtTime(0.001, now + 0.007);
			oscLatch.connect(gainLatch);
			gainLatch.connect(master);
			oscLatch.start(now);
			oscLatch.stop(now + 0.008);

			// 2. Main crisp snap (metallic contact impact, +6ms)
			const snapTime = now + 0.005;
			const oscSnap = ctx.createOscillator();
			const gainSnap = ctx.createGain();
			oscSnap.type = 'triangle';
			oscSnap.frequency.setValueAtTime(isDark ? 1900 : 2400, snapTime);
			oscSnap.frequency.exponentialRampToValueAtTime(180, snapTime + 0.038);
			gainSnap.gain.setValueAtTime(0.7, snapTime);
			gainSnap.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.038);
			oscSnap.connect(gainSnap);
			gainSnap.connect(master);
			oscSnap.start(snapTime);
			oscSnap.stop(snapTime + 0.04);

			// 3. Tactile body thud / housing resonance (warm low-frequency drop)
			const bodyTime = now + 0.006;
			const oscBody = ctx.createOscillator();
			const gainBody = ctx.createGain();
			oscBody.type = 'sine';
			oscBody.frequency.setValueAtTime(isDark ? 460 : 580, bodyTime);
			oscBody.frequency.exponentialRampToValueAtTime(70, bodyTime + 0.055);
			gainBody.gain.setValueAtTime(0.45, bodyTime);
			gainBody.gain.exponentialRampToValueAtTime(0.001, bodyTime + 0.055);
			oscBody.connect(gainBody);
			gainBody.connect(master);
			oscBody.start(bodyTime);
			oscBody.stop(bodyTime + 0.06);

			// 4. Subtle acoustic contact friction (shaped micro-noise burst)
			const noiseLen = Math.floor(ctx.sampleRate * 0.01);
			const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
			const noiseData = noiseBuf.getChannelData(0);
			for (let i = 0; i < noiseLen; i++) {
				noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseLen * 0.28));
			}
			const noiseSource = ctx.createBufferSource();
			noiseSource.buffer = noiseBuf;
			const noiseFilter = ctx.createBiquadFilter();
			noiseFilter.type = 'bandpass';
			noiseFilter.frequency.setValueAtTime(isDark ? 2600 : 3200, snapTime);
			noiseFilter.Q.setValueAtTime(2.2, snapTime);
			const noiseGain = ctx.createGain();
			noiseGain.gain.setValueAtTime(0.18, snapTime);
			noiseGain.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.01);
			noiseSource.connect(noiseFilter);
			noiseFilter.connect(noiseGain);
			noiseGain.connect(master);
			noiseSource.start(snapTime);
		} catch (e) {
			// Ignore if audio is disabled / blocked by autoplay policy
		}
	}

	function toggleTheme() {
		if (!browser) return;
		darkMode.update((cur) => {
			const next = !cur;
			localStorage.theme = next ? 'dark' : 'light';
			if (next) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
			playClick(next);
			return next;
		});

		window.dispatchEvent(
			new CustomEvent('theme-change', {
				detail: { isDark: document.documentElement.classList.contains('dark') }
			})
		);
	}

	// Underdamped harmonic oscillator solver
	function createSpringSolver(stiffness, damping, mass) {
		const omega0 = Math.sqrt(stiffness / mass);
		const zeta = damping / (2 * Math.sqrt(stiffness * mass));
		const isUnderdamped = zeta < 1;
		const omegaD = isUnderdamped ? omega0 * Math.sqrt(1 - zeta * zeta) : 0;
		const decay = zeta * omega0;

		return function (x0, v0, target, t) {
			if (isUnderdamped) {
				const A = x0 - target;
				const B = (v0 + decay * A) / omegaD;
				const env = Math.exp(-decay * t);
				const pos = target + env * (A * Math.cos(omegaD * t) + B * Math.sin(omegaD * t));
				const vel =
					env *
					((B * omegaD - A * decay) * Math.cos(omegaD * t) -
						(A * omegaD + B * decay) * Math.sin(omegaD * t));
				return { pos, vel };
			}
			const A = x0 - target;
			const B = v0 + omega0 * A;
			const env = Math.exp(-omega0 * t);
			const pos = target + env * (A + B * t);
			const vel = env * (B - (A + B * t) * omega0);
			return { pos, vel };
		};
	}

	// Exact cubic-bezier curve evaluator
	function createCubicBezier(x1, y1, x2, y2) {
		const cx = 3 * x1;
		const bx = 3 * (x2 - x1) - cx;
		const ax = 1 - cx - bx;

		const cy = 3 * y1;
		const by = 3 * (y2 - y1) - cy;
		const ay = 1 - cy - by;

		function sampleX(u) {
			return ((ax * u + bx) * u + cx) * u;
		}
		function sampleY(u) {
			return ((ay * u + by) * u + cy) * u;
		}
		function derivativeX(u) {
			return (3 * ax * u + 2 * bx) * u + cx;
		}

		return function (t) {
			if (t <= 0) return 0;
			if (t >= 1) return 1;
			let u = t;
			for (let i = 0; i < 8; i++) {
				const xEst = sampleX(u) - t;
				const dX = derivativeX(u);
				if (Math.abs(xEst) < 1e-6 || Math.abs(dX) < 1e-6) break;
				u -= xEst / dX;
			}
			return sampleY(Math.max(0, Math.min(1, u)));
		};
	}

	function stopAnimation() {
		if (currentAnimFrame) {
			cancelAnimationFrame(currentAnimFrame);
			currentAnimFrame = null;
		}
		isAnimating = false;
	}

	// Spring Y back to 0
	function springY(fromY, initialVy = 0, onComplete = null) {
		const solver = createSpringSolver(440, 11, 0.75);
		const startTime = performance.now();
		const maxDuration = 1200; // ms

		function step(now) {
			const elapsed = (now - startTime) / 1000;
			const { pos, vel } = solver(fromY, initialVy, 0, elapsed);
			y = pos;

			if (elapsed * 1000 >= maxDuration || (Math.abs(pos) < 0.05 && Math.abs(vel) < 0.5)) {
				y = 0;
				if (onComplete) onComplete();
			} else {
				currentAnimFrame = requestAnimationFrame(step);
			}
		}

		currentAnimFrame = requestAnimationFrame(step);
	}

	// Spring X back to 0 (pendulum swing)
	function springX(fromX, initialVx = 0, onComplete = null) {
		const solver = createSpringSolver(280, 8, 0.85);
		const startTime = performance.now();
		const maxDuration = 1600; // ms

		function step(now) {
			const elapsed = (now - startTime) / 1000;
			const { pos, vel } = solver(fromX, initialVx, 0, elapsed);
			x = pos;

			if (elapsed * 1000 >= maxDuration || (Math.abs(pos) < 0.05 && Math.abs(vel) < 0.5)) {
				x = 0;
				if (onComplete) onComplete();
			} else {
				requestAnimationFrame(step);
			}
		}

		requestAnimationFrame(step);
	}

	// Interpolate keyframe array with easing
	function animateKeyframes(keyframes, duration, bezierPoints, onUpdate, onComplete) {
		const ease = createCubicBezier(...bezierPoints);
		const startTime = performance.now();
		const n = keyframes.length - 1;

		function step(now) {
			const elapsed = now - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = ease(progress);

			const scaled = eased * n;
			const idx = Math.min(Math.floor(scaled), n - 1);
			const frac = scaled - idx;
			const val = keyframes[idx] + (keyframes[idx + 1] - keyframes[idx]) * frac;
			onUpdate(val);

			if (progress < 1) {
				requestAnimationFrame(step);
			} else {
				onUpdate(keyframes[n]);
				if (onComplete) onComplete();
			}
		}

		requestAnimationFrame(step);
	}

	// Pull-down click interaction
	function handleClick() {
		if (isDragging || isAnimating) return;
		isAnimating = true;

		// 1. Pull down to y = 52 over 220ms
		const startY = y;
		const ease = createCubicBezier(0.25, 1, 0.5, 1);
		const startTime = performance.now();
		const pullDuration = 220;

		function pullStep(now) {
			const progress = Math.min((now - startTime) / pullDuration, 1);
			y = startY + (52 - startY) * ease(progress);

			if (progress < 1) {
				currentAnimFrame = requestAnimationFrame(pullStep);
			} else {
				// 2. Trigger toggle and release springs
				toggleTheme();

				// Release Y back to 0 with spring
				const springSolver = createSpringSolver(420, 10, 0.7);
				const springStart = performance.now();

				function releaseStep(tNow) {
					const elapsed = (tNow - springStart) / 1000;
					const { pos, vel } = springSolver(52, 0, 0, elapsed);
					y = pos;

					if (elapsed > 1.0 || (Math.abs(pos) < 0.05 && Math.abs(vel) < 0.5)) {
						y = 0;
						isAnimating = false;
					} else {
						currentAnimFrame = requestAnimationFrame(releaseStep);
					}
				}
				currentAnimFrame = requestAnimationFrame(releaseStep);

				// Swing X with exact keyframe wave: [0, -12, 10, -7, 4, -2, 0]
				animateKeyframes(
					[0, -12, 10, -7, 4, -2, 0],
					1200,
					[0.25, 1, 0.5, 1],
					(v) => (x = v),
					() => (x = 0)
				);
			}
		}

		currentAnimFrame = requestAnimationFrame(pullStep);
	}

	// Hover gentle sway
	function handleMouseEnter() {
		isHovered = true;
		if (isDragging || isAnimating || Math.abs(x) > 1 || Math.abs(y) > 1) return;
		animateKeyframes(
			[0, 5, -4, 2.5, -1, 0],
			700,
			[0.33, 1, 0.68, 1],
			(v) => {
				if (!isDragging && !isAnimating) x = v;
			},
			() => {
				if (!isDragging && !isAnimating) x = 0;
			}
		);
	}

	function handleMouseLeave() {
		isHovered = false;
	}

	// Dragging logic
	let dragStartPos = { x: 0, y: 0 };
	let dragStartPointer = { x: 0, y: 0 };
	let lastPointer = { x: 0, y: 0, time: 0 };
	let dragVelocity = { x: 0, y: 0 };
	let dragDistance = 0;

	function handlePointerDown(e) {
		if (e.button !== 0) return;
		e.preventDefault();
		stopAnimation();

		isDragging = true;
		dragStartPos = { x, y };
		dragStartPointer = { x: e.clientX, y: e.clientY };
		lastPointer = { x: e.clientX, y: e.clientY, time: performance.now() };
		dragVelocity = { x: 0, y: 0 };
		dragDistance = 0;

		if (e.currentTarget?.setPointerCapture) {
			try {
				e.currentTarget.setPointerCapture(e.pointerId);
			} catch (err) {}
		}

		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerUp);
		window.addEventListener('pointercancel', handlePointerUp);
	}

	function handlePointerMove(e) {
		if (!isDragging) return;

		const dx = e.clientX - dragStartPointer.x;
		const dy = e.clientY - dragStartPointer.y;
		dragDistance = Math.hypot(dx, dy);

		// Calculate elastic clamped Y (top: 0, bottom: 110)
		const rawY = dragStartPos.y + dy;
		if (rawY < 0) {
			y = rawY * 0.35;
		} else if (rawY > 110) {
			y = 110 + (rawY - 110) * 0.35;
		} else {
			y = rawY;
		}

		// Calculate elastic clamped X (left: -140, right: 32)
		const rawX = dragStartPos.x + dx;
		if (rawX < -140) {
			x = -140 + (rawX - -140) * 0.35;
		} else if (rawX > 32) {
			x = 32 + (rawX - 32) * 0.35;
		} else {
			x = rawX;
		}

		// Track velocity
		const now = performance.now();
		const dt = Math.max((now - lastPointer.time) / 1000, 0.001);
		const instantVx = (e.clientX - lastPointer.x) / dt;
		const instantVy = (e.clientY - lastPointer.y) / dt;
		dragVelocity.x = dragVelocity.x * 0.6 + instantVx * 0.4;
		dragVelocity.y = dragVelocity.y * 0.6 + instantVy * 0.4;
		lastPointer = { x: e.clientX, y: e.clientY, time: now };
	}

	function handlePointerUp(e) {
		if (!isDragging) return;
		isDragging = false;

		window.removeEventListener('pointermove', handlePointerMove);
		window.removeEventListener('pointerup', handlePointerUp);
		window.removeEventListener('pointercancel', handlePointerUp);

		// Check if it was a quick click / tap with negligible movement
		if (dragDistance < 4) {
			handleClick();
			return;
		}

		// Check if pulled past toggle threshold
		const hyp = Math.hypot(x, y);
		if (y >= 40 || hyp >= 50 || dragVelocity.y > 180) {
			toggleTheme();
		}

		// Spring back to equilibrium
		springY(y, dragVelocity.y);
		springX(x, dragVelocity.x);
	}

	function handleKeyDown(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick();
		}
	}

	onMount(() => {
		isMounted = true;
		return () => {
			stopAnimation();
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('pointerup', handlePointerUp);
			window.removeEventListener('pointercancel', handlePointerUp);
		};
	});
</script>

{#if isMounted}
	<div
		class="hidden md:block fixed top-0 right-0 z-50 pointer-events-none select-none {className}"
		style="width: 240px; height: 280px; perspective: 1000px;"
	>
		<!-- Top ceiling fixture / bracket -->
		<div
			class="absolute top-0 z-10 flex flex-col items-center pointer-events-auto"
			style="left: 200px; transform: translateX(-50%);"
		>
			<div class="w-5 h-1.5 bg-neutral-400 dark:bg-neutral-600 rounded-b-[2px]"></div>
			<div class="w-2 h-1 bg-neutral-500 dark:bg-neutral-500 rounded-b-full -mt-[0.5px]"></div>
		</div>

		<!-- Beaded pull-chain line -->
		<svg
			class="absolute inset-0 z-0 w-full h-full overflow-visible pointer-events-none"
			aria-hidden="true"
		>
			<line
				x1="200"
				y1="6"
				x2={200 + x}
				y2={88 + y + 2}
				stroke="currentColor"
				class="text-neutral-700 dark:text-neutral-300"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-dasharray="1 3.4"
			/>
		</svg>

		<!-- Hanging Pull Handle / Fob -->
		<div
			role="button"
			tabindex="0"
			aria-label={`Pull cord to switch to ${$darkMode ? 'light' : 'dark'} mode`}
			onpointerdown={handlePointerDown}
			onmouseenter={handleMouseEnter}
			onmouseleave={handleMouseLeave}
			onkeydown={handleKeyDown}
			style="
				left: 200px;
				top: 88px;
				transform-origin: top center;
				transform: translate3d({x}px, {y}px, 0) rotate({rotate}deg) scale({scaleX}, {scaleY});
			"
			class="absolute z-10 -ml-[8px] flex flex-col items-center cursor-grab active:cursor-grabbing focus:outline-none pointer-events-auto"
		>
			<div
				class="relative w-4 h-11 rounded-full transition-colors duration-300 shadow-sm
					{$darkMode ? 'bg-[#f2f2f2] border border-[#e0e0e0]' : 'bg-[#181818] border border-[#2c2c2c]'}"
			>
				<!-- 3 horizontal grip notches in center -->
				<div
					class="absolute inset-x-1 top-3 bottom-3 flex flex-col justify-center items-center gap-[3px]"
				>
					<div class="w-2 h-[1px] {$darkMode ? 'bg-[#b0b0b0]' : 'bg-[#383838]'} rounded-full"></div>
					<div class="w-2 h-[1px] {$darkMode ? 'bg-[#b0b0b0]' : 'bg-[#383838]'} rounded-full"></div>
					<div class="w-2 h-[1px] {$darkMode ? 'bg-[#b0b0b0]' : 'bg-[#383838]'} rounded-full"></div>
				</div>

				<!-- Subtle specular highlight line on left edge -->
				<div
					class="absolute top-1 left-0.5 bottom-1 w-[1px] rounded-full
						{$darkMode ? 'bg-white/80' : 'bg-white/15'}"
				></div>
			</div>

			<!-- Hover tooltip badge -->
			{#if isHovered && !isDragging}
				<div
					transition:fade={{ duration: 160 }}
					class="absolute right-6 top-2 whitespace-nowrap pointer-events-none flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
						bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-[10px] font-medium tracking-wide font-sans
						border border-neutral-700 dark:border-neutral-200 shadow-sm select-none"
				>
					<span>{$darkMode ? 'Light' : 'Dark'}</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						stroke-width="1.75"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="w-2.5 h-2.5 opacity-70 shrink-0"
						aria-hidden="true"
					>
						<line x1="6" y1="2" x2="6" y2="10" />
						<polyline points="3.5,7.5 6,10 8.5,7.5" />
					</svg>
				</div>
			{/if}
		</div>
	</div>
{/if}
