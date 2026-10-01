<script>
	import { getStroke } from 'perfect-freehand';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { doodle } from './doodle.svelte.js';

	/**
	 * The ink layer for doodle mode. It covers its positioned parent, so anything
	 * drawn scrolls with the page. Strokes are measured from the page's centre
	 * line (so they stay put on the centred layout when the window is resized) and
	 * kept in localStorage per page, so a visitor's doodles are still there when
	 * they come back.
	 */
	const STORAGE_PREFIX = 'yaqeen:doodles:';
	const MAX_STROKES = 400;
	const inks = [
		{ name: 'red', css: 'var(--color-accent)', nib: '#f9411f' },
		{ name: 'ink', css: 'var(--color-text-main)', nib: '#57534e' },
		{ name: 'blue', css: '#3b82f6', nib: '#3b82f6' },
		{ name: 'green', css: '#22a06b', nib: '#22a06b' }
	];

	let layer = $state(null);
	let strokes = $state([]);
	let points = $state([]);
	let ink = $state(inks[0]);
	let pointerId = null;

	const live = $derived(outline(points));

	// A little pencil whose tip matches the chosen ink.
	const cursor = $derived(
		`url("data:image/svg+xml,${encodeURIComponent(
			`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path d="M3 25l2.2-7.2L19 4l5 5L10.2 22.8z" fill="#fdf3dc" stroke="#1c1917" stroke-width="1.4" stroke-linejoin="round"/><path d="M3 25l2.2-7.2 5 5z" fill="${ink.nib}" stroke="#1c1917" stroke-width="1.4" stroke-linejoin="round"/></svg>`
		)}") 3 25, crosshair`
	);

	const storageKey = $derived(STORAGE_PREFIX + page.url.pathname);

	// Every page has its own sheet: put the pen down and swap drawings on arrival.
	afterNavigate(() => {
		doodle.active = false;
		let saved = [];
		try {
			saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
		} catch {
			// Nothing saved, or nothing readable: start with a clean page.
		}
		strokes = Array.isArray(saved) ? saved : [];
	});

	function remember() {
		try {
			if (strokes.length) localStorage.setItem(storageKey, JSON.stringify(strokes));
			else localStorage.removeItem(storageKey);
		} catch {
			// Storage is full or blocked; the doodles still live until the tab closes.
		}
	}

	function outline(stroke) {
		if (!stroke.length) return '';
		const shape = getStroke(stroke.length === 1 ? [stroke[0], stroke[0]] : stroke, {
			size: 5.5,
			thinning: 0.55,
			smoothing: 0.6,
			streamline: 0.45,
			simulatePressure: true,
			last: true
		});
		if (!shape.length) return '';

		let d = `M ${shape[0][0].toFixed(1)} ${shape[0][1].toFixed(1)} Q`;
		for (let index = 0; index < shape.length; index += 1) {
			const [x0, y0] = shape[index];
			const [x1, y1] = shape[(index + 1) % shape.length];
			d += ` ${x0.toFixed(1)} ${y0.toFixed(1)} ${((x0 + x1) / 2).toFixed(1)} ${((y0 + y1) / 2).toFixed(1)}`;
		}
		return `${d} Z`;
	}

	function locate(event) {
		const rect = layer.getBoundingClientRect();
		return [event.clientX - rect.left - rect.width / 2, event.clientY - rect.top, 0.5];
	}

	function begin(event) {
		if (event.button !== 0) return;
		pointerId = event.pointerId;
		layer.setPointerCapture(pointerId);
		points = [locate(event)];
	}

	function extend(event) {
		if (event.pointerId !== pointerId) return;
		const next = (event.getCoalescedEvents?.() ?? [event]).map(locate);
		points = [...points, ...next];
	}

	function finish(event) {
		if (event.pointerId !== pointerId) return;
		pointerId = null;
		if (points.length) {
			strokes = [...strokes, { ink: ink.name, d: outline(points) }].slice(-MAX_STROKES);
			remember();
		}
		points = [];
	}

	function undo() {
		strokes = strokes.slice(0, -1);
		remember();
	}

	function clear() {
		strokes = [];
		remember();
	}

	function onKeydown(event) {
		if (!doodle.active) return;
		if (event.key === 'Escape') {
			doodle.active = false;
		} else if (event.key === 'z' && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			undo();
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

<svg
	bind:this={layer}
	class="ink-layer"
	class:drawing={doodle.active}
	style:cursor={doodle.active ? cursor : null}
	aria-hidden="true"
	onpointerdown={begin}
	onpointermove={extend}
	onpointerup={finish}
	onpointercancel={finish}
>
	<g class="from-centre">
		{#each strokes as stroke, index (index)}
			<path d={stroke.d} class={stroke.ink} />
		{/each}
		{#if live}
			<path d={live} class={ink.name} />
		{/if}
	</g>
</svg>

{#if doodle.active}
	<div class="tray" role="toolbar" aria-label="Doodle tools">
		<div class="inks" role="radiogroup" aria-label="Ink colour">
			{#each inks as option (option.name)}
				<button
					type="button"
					class="pot"
					role="radio"
					aria-checked={ink === option}
					aria-label={`${option.name} ink`}
					style="--ink: {option.css}"
					onclick={() => (ink = option)}
				></button>
			{/each}
		</div>
		<button type="button" class="tool" onclick={undo} disabled={!strokes.length}>undo</button>
		<button type="button" class="tool" onclick={clear} disabled={!strokes.length}>clear</button>
		<button type="button" class="tool done" onclick={() => (doodle.active = false)}>done</button>
	</div>
{/if}

<style>
	.ink-layer {
		position: absolute;
		inset: 0;
		z-index: 60;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
	}

	.ink-layer.drawing {
		pointer-events: auto;
		touch-action: none;
	}

	.from-centre {
		transform: translateX(50%);
	}

	path.red {
		fill: var(--color-accent);
	}

	path.ink {
		fill: var(--color-text-main);
	}

	path.blue {
		fill: #3b82f6;
	}

	path.green {
		fill: #22a06b;
	}

	.tray {
		position: fixed;
		bottom: 1.25rem;
		left: 50%;
		z-index: 70;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem;
		border: 1px solid color-mix(in srgb, var(--color-text-main) 14%, transparent);
		border-radius: 0.9rem;
		background: var(--color-surface);
		box-shadow: 0 14px 30px -14px rgb(28 25 23 / 0.55);
		transform: translateX(-50%);
		animation: tray-in 260ms cubic-bezier(0.2, 0.9, 0.25, 1.2);
	}

	.inks {
		display: flex;
		gap: 0.35rem;
		padding-inline: 0.3rem 0.5rem;
	}

	.pot {
		width: 1.35rem;
		height: 1.35rem;
		padding: 0;
		border: 2px solid var(--color-surface);
		border-radius: 50%;
		background: var(--ink);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-text-main) 22%, transparent);
		cursor: pointer;
		transition: transform 160ms cubic-bezier(0.2, 0.9, 0.25, 1.5);
	}

	.pot[aria-checked='true'] {
		box-shadow: 0 0 0 2px var(--color-text-main);
		transform: scale(1.15);
	}

	.tool {
		padding: 0.3rem 0.65rem;
		border: 1px solid color-mix(in srgb, var(--color-text-main) 16%, transparent);
		border-radius: 0.55rem;
		background: var(--color-surface-muted);
		color: var(--color-text-main);
		font-family: 'Commit Mono', ui-monospace, monospace;
		font-size: 0.7rem;
		box-shadow: 0 2px 0 color-mix(in srgb, var(--color-text-main) 20%, transparent);
		cursor: pointer;
		transition:
			transform 90ms ease,
			box-shadow 90ms ease;
	}

	.tool:active:not(:disabled) {
		transform: translateY(2px);
		box-shadow: 0 0 0 transparent;
	}

	.tool:disabled {
		opacity: 0.45;
		cursor: default;
	}

	.tool.done {
		border-color: transparent;
		background: var(--color-accent);
		color: #fff;
		box-shadow: 0 2px 0 color-mix(in srgb, var(--color-accent) 60%, #000);
	}

	@keyframes tray-in {
		from {
			opacity: 0;
			transform: translate(-50%, 1rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tray {
			animation: none;
		}

		.pot,
		.tool {
			transition: none;
		}
	}
</style>
