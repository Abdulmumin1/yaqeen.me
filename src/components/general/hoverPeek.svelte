<script>
	import { onDestroy } from 'svelte';
	import DitherField from '$components/general/ditherField.svelte';
	import { NO_UI, peeks } from '$lib/data/peeks.js';

	/**
	 * Wraps a stretch of page. Hovering (or tabbing to) anything in it marked
	 * `data-peek="<name>"` floats a small print beside it, whichever kind
	 * $lib/data/peeks.js gives that name: a screenshot on a dithered mat, a
	 * portrait with a caption, or a receipt for the projects that have no
	 * interface to show.
	 *
	 * Rows sharing a `data-peek-group` ancestor are scrubbed as one strip: the
	 * print stays up across the gaps and cuts straight from one to the next.
	 *
	 * It is for the mouse and the keyboard. Touch gets the plain page, except
	 * that something also marked `data-peek-tap` (a button, never a link) shows
	 * its print when tapped, and puts it away when tapped again.
	 *
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} children
	 * @property {{ name: string, description?: string, imagelist?: string[] }[]} subjects
	 *   What in here can be peeked at. `description` goes on a receipt, and the
	 *   first of `imagelist` stands in when the peek has no picture of its own.
	 */

	/** @type {Props} */
	let { children, subjects } = $props();

	const REST = 1.5;

	let list = $state(null);
	let card = $state(null);
	let name = $state(null);
	let shown = $state(false);
	// Nothing is fetched until someone actually comes near.
	let armed = $state(false);

	// From then on every picture stays mounted (and decoded), so scrubbing never waits on one.
	const pictures = $derived(
		subjects
			.filter((item) => peeks[item.name] && peeks[item.name] !== NO_UI)
			.map((item) => ({
				name: item.name,
				src: peeks[item.name].image ?? item.imagelist?.[0],
				portrait: Boolean(peeks[item.name].caption)
			}))
			.filter((picture) => picture.src)
	);
	const peek = $derived(name && peeks[name] !== NO_UI ? peeks[name] : null);
	const subject = $derived(subjects.find((item) => item.name === name));

	const pointer = { x: 0, y: 0 };
	let anchor = null; // the box of whatever was tapped, while a tap is what opened it
	let touched = false;
	let x = 0;
	let y = 0;
	let lean = 0;
	let frame = 0;
	let snap = true;

	function follow() {
		frame = 0;
		if (!card || !list) return;

		const bounds = list.getBoundingClientRect();
		const width = card.offsetWidth;
		const height = card.offsetHeight;
		let left = bounds.right + 36;
		let top;

		if (anchor) {
			// Opened with a tap: it hangs under whatever was tapped, or over it if there is no room.
			const middle = anchor.left + anchor.width / 2;
			left = Math.min(Math.max(middle - width / 2, 12), window.innerWidth - width - 12);
			top = anchor.bottom + 14;
			if (top + height > window.innerHeight - 12) top = Math.max(anchor.top - 14 - height, 12);
		} else if (left + width <= window.innerWidth - 20) {
			// Room in the margin: dock beside the list and ride up and down with the cursor.
			// The light-switch cord hangs in the top right corner on wider screens; stay under it.
			const underCord = window.innerWidth >= 768 && left + width > window.innerWidth - 64;
			const ceiling = underCord ? 148 : 12;
			top = Math.min(
				Math.max(pointer.y - height * 0.45, ceiling),
				Math.max(window.innerHeight - height - 12, ceiling)
			);
		} else {
			// No margin to speak of: hang just under the cursor, like a tooltip, so the
			// row being read stays readable. Flip above it near the bottom of the window.
			left = Math.min(Math.max(pointer.x + 16, 12), window.innerWidth - width - 12);
			top = pointer.y + 26;
			if (top + height > window.innerHeight - 12) top = pointer.y - 26 - height;
		}

		const settle = snap || anchor || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (settle) {
			x = left;
			y = top;
			lean = 0;
		} else {
			// Trail the cursor a little, and swing with the lag like something on a string.
			lean += (Math.max(-7, Math.min(7, (top - y) * 0.1)) - lean) * 0.18;
			x += (left - x) * 0.2;
			y += (top - y) * 0.2;
		}

		card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(REST + lean).toFixed(2)}deg)`;
		// Something that hangs from a fixed spot needs placing once (and once more, when its size is known).
		if (shown && (!anchor || snap)) frame = requestAnimationFrame(follow);
		snap = false;
	}

	function show(next, clientX, clientY) {
		pointer.x = clientX;
		pointer.y = clientY;
		name = next;
		if (!shown) {
			snap = true;
			shown = true;
		}
		if (!frame) frame = requestAnimationFrame(follow);
	}

	function hide() {
		shown = false;
		if (!anchor) return;
		anchor = null;
		window.removeEventListener('pointerdown', onPointerDownOutside, true);
		window.removeEventListener('scroll', hide);
	}

	/** In the gap between two rows of the same group, the last print stays up. */
	function betweenRows(event) {
		const rows = event.target.closest?.('[data-peek-group]')?.querySelectorAll('[data-peek]');
		if (!rows?.length) return false;
		return (
			event.clientY >= rows[0].getBoundingClientRect().top &&
			event.clientY <= rows[rows.length - 1].getBoundingClientRect().bottom
		);
	}

	function onPointerMove(event) {
		if (event.pointerType !== 'mouse') return;
		armed = true;
		if (anchor) hide();
		const row = event.target.closest?.('[data-peek]');
		if (row && peeks[row.dataset.peek]) {
			show(row.dataset.peek, event.clientX, event.clientY);
		} else if (!row && shown && betweenRows(event)) {
			pointer.x = event.clientX;
			pointer.y = event.clientY;
		} else {
			hide();
		}
	}

	function onFocusIn(event) {
		const row = event.target.closest?.('[data-peek]');
		if (!row || !peeks[row.dataset.peek] || !event.target.matches(':focus-visible')) return;
		armed = true;
		const rect = event.target.getBoundingClientRect();
		show(row.dataset.peek, rect.right, rect.top + rect.height / 2);
	}

	function onFocusOut() {
		// A print opened with a tap stays until the next tap: not every browser focuses what is tapped.
		if (!anchor) hide();
	}

	function onPointerDown(event) {
		touched = event.pointerType !== 'mouse';
		// A finger is about to ask for this one: start fetching its picture now.
		if (touched && event.target.closest?.('[data-peek-tap]')) armed = true;
	}

	function onClick(event) {
		const row = event.target.closest?.('[data-peek-tap]');
		if (!touched || !row || !peeks[row.dataset.peek]) return;
		if (anchor && name === row.dataset.peek) return hide();
		const rect = row.getBoundingClientRect();
		const opening = !anchor;
		anchor = rect;
		snap = true;
		show(row.dataset.peek, rect.left + rect.width / 2, rect.bottom);
		if (!opening) return;
		window.addEventListener('pointerdown', onPointerDownOutside, true);
		window.addEventListener('scroll', hide, { passive: true });
	}

	function onPointerDownOutside(event) {
		if (!event.target.closest?.('[data-peek-tap]')) hide();
	}

	onDestroy(() => {
		if (frame) cancelAnimationFrame(frame);
		if (typeof window === 'undefined') return;
		window.removeEventListener('pointerdown', onPointerDownOutside, true);
		window.removeEventListener('scroll', hide);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
<div
	bind:this={list}
	onpointermove={onPointerMove}
	onpointerleave={() => !anchor && hide()}
	onpointerdown={onPointerDown}
	onclick={onClick}
	onfocusin={onFocusIn}
	onfocusout={onFocusOut}
>
	{@render children()}
</div>

<div bind:this={card} class="peek" class:shown aria-hidden="true">
	<div class="print" class:off={!peek} class:portrait={peek?.caption}>
		{#if shown && peek}
			<div class="mat" style="background: {peek.ramp[1]}">
				<DitherField
					pattern={peek.pattern}
					ramp={peek.ramp}
					matrix={peek.matrix}
					cell={5}
					seed={5}
				/>
			</div>
		{/if}
		<div class="mount">
			<div class="frame">
				{#if armed}
					{#each pictures as picture (picture.name)}
						<img
							src={picture.src}
							alt=""
							width={picture.portrait ? 480 : 800}
							height={picture.portrait ? 600 : 500}
							class:on={picture.name === name}
						/>
					{/each}
				{/if}
			</div>
			{#if peek?.caption}
				<p class="caption">{peek.caption}</p>
			{/if}
		</div>
	</div>

	{#if name && peeks[name] === NO_UI && subject}
		<div class="slip">
			<div class="paper">
				<svg viewBox="0 0 24 24">
					<path d="M15.5 3.2a9 9 0 1 0 5.3 14.3A7.2 7.2 0 0 1 15.5 3.2Z" />
				</svg>
				<p class="title">no ui whatsoever</p>
				<hr />
				<p class="item">{subject.name}</p>
				<p class="about">{subject.description}</p>
				<hr />
				<p class="total"><span>pixels</span><span>0</span></p>
			</div>
		</div>
	{/if}
</div>

<style>
	/* It eases in, but leaves (and changes subject) at once: scrubbing the list stays crisp. */
	.peek {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 40;
		visibility: hidden;
		opacity: 0;
		pointer-events: none;
		will-change: transform;
	}

	.peek.shown {
		visibility: visible;
		opacity: 1;
		transition: opacity 160ms ease;
	}

	.print,
	.slip {
		transform: scale(0.94);
		transform-origin: 0 50%;
	}

	.shown .print,
	.shown .slip {
		transform: scale(1);
		transition: transform 260ms cubic-bezier(0.2, 0.9, 0.25, 1.3);
	}

	.print {
		position: relative;
		width: 20rem;
		padding: 0.7rem;
		overflow: hidden;
		border-radius: 0.9rem;
		box-shadow:
			0 1px 2px rgb(28 25 23 / 0.14),
			0 20px 34px -18px rgb(28 25 23 / 0.55);
	}

	.print.off {
		display: none;
	}

	.mat {
		position: absolute;
		inset: 0;
	}

	.mount {
		position: relative;
	}

	.frame {
		position: relative;
		aspect-ratio: 8 / 5;
		overflow: hidden;
		border-radius: 0.4rem;
		background: #faf7f2;
		box-shadow:
			0 0 0 1px rgb(28 25 23 / 0.16),
			0 8px 16px -8px rgb(28 25 23 / 0.5);
	}

	.frame img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
		visibility: hidden;
	}

	.frame img.on {
		visibility: visible;
	}

	/* A portrait: a narrower print, the picture mounted on paper with the name written under it. */
	.print.portrait {
		width: 12.5rem;
	}

	.portrait .mount {
		padding: 0.4rem 0.4rem 0;
		border-radius: 0.35rem;
		background: #fbf8f3;
		box-shadow:
			0 0 0 1px rgb(28 25 23 / 0.16),
			0 8px 16px -8px rgb(28 25 23 / 0.5);
	}

	.portrait .frame {
		aspect-ratio: 4 / 5;
		border-radius: 0.2rem;
		box-shadow: 0 0 0 1px rgb(28 25 23 / 0.1);
	}

	.portrait .frame img {
		object-position: center;
	}

	.caption {
		margin: 0;
		padding: 0.5rem 0.1rem 0.55rem;
		color: #292524;
		font-family: var(--font-comic);
		font-size: 0.84rem;
		line-height: 1.1;
		letter-spacing: 0.01em;
		text-align: center;
	}

	/* The receipt, for the things that only exist in a terminal. */
	.slip {
		width: 13.5rem;
		filter: drop-shadow(0 1px 1px rgb(28 25 23 / 0.14)) drop-shadow(0 14px 16px rgb(28 25 23 / 0.2));
	}

	.paper {
		--tooth: 0.5rem;
		padding: 1.35rem 1rem 1.3rem;
		background: #fffdf8;
		color: #292524;
		font-family: 'Commit Mono', ui-monospace, monospace;
		font-size: 0.66rem;
		line-height: 1.5;
		/* Saw-toothed edges, torn off the roll top and bottom. */
		mask:
			conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom /
				var(--tooth) 51% repeat-x,
			conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top / var(--tooth) 51%
				repeat-x;
	}

	:global(.dark) .paper {
		background: #ece6da;
	}

	.paper p {
		margin: 0;
	}

	.paper svg {
		display: block;
		width: 1.2rem;
		margin: 0 auto 0.25rem;
		fill: currentColor;
	}

	.title {
		font-weight: 700;
		letter-spacing: 0.1em;
		text-align: center;
		text-transform: uppercase;
	}

	.paper hr {
		margin: 0.55rem 0;
		border: 0;
		border-top: 1px dashed #a8a29e;
	}

	.item {
		font-weight: 700;
	}

	.about {
		display: -webkit-box;
		overflow: hidden;
		color: #78716c;
		font-size: 0.6rem;
		line-height: 1.45;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
	}

	.total {
		display: flex;
		justify-content: space-between;
		font-weight: 700;
		text-transform: uppercase;
	}

	@media (prefers-reduced-motion: reduce) {
		.peek.shown,
		.shown .print,
		.shown .slip {
			transition: none;
		}
	}
</style>
