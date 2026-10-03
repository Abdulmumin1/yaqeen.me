<script>
	import DitherField from '$components/general/ditherField.svelte';
	import { linksOf } from '$lib/data/work.js';

	/**
	 * Press play and the house lights go down: the window fills with a slow
	 * dither in the product's colours, and the video comes forward. Escape, the
	 * close button or a click on the dark brings the board back.
	 *
	 * @typedef {Object} Props
	 * @property {any} entry - The entry playing, or null.
	 * @property {() => void} [onclose]
	 */

	/** @type {Props} */
	let { entry = null, onclose } = $props();

	let dialog = $state(null);

	const fallbackRoom = {
		pattern: 'clouds',
		matrix: 4,
		ramp: ['#0c0a09', '#1c1714', '#2b221c', '#3d2f25', '#54402f']
	};
	const room = $derived(entry?.room ?? fallbackRoom);
	const media = $derived(entry?.media);
	const isImage = $derived(media?.type === 'image');
	// The shape of what is on stage, so it can be as big as the window allows.
	const ratio = $derived.by(() => {
		const [w, h] = (media?.ratio ?? '16 / 9').split('/').map(Number);
		return w / h;
	});
	const links = $derived(linksOf(entry));

	$effect(() => {
		if (!dialog) return;
		if (entry && !dialog.open) dialog.showModal();
		if (!entry && dialog.open) dialog.close();
	});

	function close() {
		dialog?.close();
	}
</script>

<dialog
	bind:this={dialog}
	class="theater"
	aria-label={entry?.title ?? 'Viewer'}
	onclose={() => onclose?.()}
>
	{#if entry}
		<!-- First, so it is what the dialog focuses when it opens. -->
		<button type="button" class="close" onclick={close}>close <kbd>esc</kbd></button>

		<!-- The dark itself: clicking anywhere on it closes too. -->
		<button type="button" class="house-lights" tabindex="-1" aria-label="Close" onclick={close}>
			<DitherField pattern={room.pattern} ramp={room.ramp} matrix={room.matrix} seed={4} />
		</button>

		<figure class="stage" style:--ratio={ratio}>
			<div class="screen" class:still={isImage} style:aspect-ratio={media?.ratio ?? '16 / 9'}>
				{#if media?.type === 'youtube'}
					<iframe
						src={`https://www.youtube.com/embed/${media.id}?autoplay=1&rel=0&modestbranding=1`}
						title={entry.title}
						allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
						allowfullscreen
					></iframe>
				{:else if media?.type === 'video'}
					<!-- svelte-ignore a11y_media_has_caption -->
					<video src={media.src} poster={media.poster} controls autoplay playsinline></video>
				{:else if isImage}
					<img src={media.src} alt={entry.title} />
				{/if}
			</div>
			<figcaption>
				<span class="title">{entry.title}</span>
				{#if entry.year}<span class="year">{entry.year}</span>{/if}
				{#if entry.summary}<span class="summary">{entry.summary}</span>{/if}
				{#each links as link (link.name)}
					<a href={link.href} target={link.target} rel={link.rel}>{link.name} {link.arrow}</a>
				{/each}
			</figcaption>
		</figure>
	{/if}
</dialog>

<style>
	.theater {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100dvh;
		max-width: none;
		max-height: none;
		padding: 0;
		border: 0;
		background: #0c0a09;
		color: rgb(245 245 244 / 0.86);
		overflow: hidden;
	}

	.theater[open] {
		display: grid;
		place-items: center;
		animation: lights-down 360ms ease both;
	}

	.theater::backdrop {
		background: transparent;
	}

	.house-lights {
		position: absolute;
		inset: 0;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: default;
	}

	.close {
		position: absolute;
		top: 1.25rem;
		right: 1.5rem;
		z-index: 2;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.75rem;
		border: 1px solid rgb(255 255 255 / 0.16);
		border-radius: 999px;
		background: rgb(12 10 9 / 0.5);
		color: inherit;
		font-family: var(--site-font-utility);
		font-size: 0.75rem;
		cursor: pointer;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	.close:hover {
		color: #fff;
	}

	kbd {
		padding: 0 0.3rem;
		border: 1px solid rgb(255 255 255 / 0.2);
		border-radius: 0.25rem;
		font-family: inherit;
		font-size: 0.6875rem;
	}

	/* As big as the window allows, whatever its shape, with room for the caption. */
	.stage {
		position: relative;
		z-index: 1;
		width: min(92vw, 68rem, calc((100dvh - 10rem) * var(--ratio, 1.7778)));
		margin: 0;
	}

	.screen {
		position: relative;
		overflow: hidden;
		border-radius: 0.75rem;
		background: #000;
		box-shadow: 0 30px 80px -30px rgb(0 0 0 / 0.8);
	}

	.screen.still {
		background: transparent;
	}

	.screen iframe,
	.screen video,
	.screen img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
		object-fit: contain;
	}

	figcaption {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem 1rem;
		padding: 1rem 0.25rem 0;
		font-size: 0.875rem;
	}

	figcaption .title {
		color: #fff;
		font-family: var(--site-font-display);
		font-size: 1.25rem;
	}

	figcaption .year {
		color: rgb(245 245 244 / 0.55);
		font-family: var(--site-font-utility);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
	}

	figcaption .summary {
		flex: 1 1 18rem;
		color: rgb(245 245 244 / 0.7);
	}

	figcaption a {
		color: rgb(245 245 244 / 0.8);
		font-family: var(--site-font-utility);
		font-size: 0.75rem;
		text-decoration: underline;
		text-decoration-color: rgb(255 255 255 / 0.25);
		text-underline-offset: 0.2em;
	}

	figcaption a:hover {
		color: #fff;
		text-decoration-color: var(--color-accent);
	}

	@keyframes lights-down {
		from {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.theater[open] {
			animation: none;
		}
	}
</style>
