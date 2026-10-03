<script>
	import { on } from 'svelte/events';
	import { linksOf } from '$lib/data/work.js';
	import { highlight } from '$lib/utils/highlight.js';

	/**
	 * One piece of work, as a note: what it is called and what it is first,
	 * then the thing itself (a film, a poster, a few lines of code), then when
	 * and where to go next.
	 *
	 * @typedef {Object} Props
	 * @property {any} entry - An entry from $lib/data/work.js.
	 * @property {(entry: any) => void} [onopen] - Play it, or look closer.
	 */

	/** @type {Props} */
	let { entry, onopen } = $props();

	const media = $derived(entry.media);
	const opens = $derived(['youtube', 'video', 'image'].includes(media?.type));
	const playable = $derived(media?.type === 'youtube' || media?.type === 'video');
	const poster = $derived(
		media?.type === 'youtube'
			? `https://i.ytimg.com/vi/${media.id}/maxresdefault.jpg`
			: media?.type === 'image'
				? media.src
				: media?.poster
	);
	const code = $derived(media?.type === 'code' ? highlight(media.code, media.lang) : '');
	const links = $derived(linksOf(entry));

	let videoReady = $state(false);

	const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// A film's clip plays while it is on screen, and never for anyone who has
	// asked for less motion.
	function playWhileSeen(video) {
		if (reducedMotion()) return;
		const observer = new IntersectionObserver(
			([seen]) => {
				if (seen.isIntersecting) video.play().catch(() => {});
				else video.pause();
			},
			{ threshold: 0.4 }
		);
		observer.observe(video);
		return () => observer.disconnect();
	}

	// A terminal session waits to be pointed at: a chapter of them all typing
	// at once is too much. It plays while the pointer is on its card, or the
	// card's button has the keyboard's focus, and goes back to its poster after.
	function playOnHover(video) {
		if (reducedMotion()) return;
		const card = video.closest('.card');
		const button = video.closest('.media');
		const play = () => video.play().catch(() => {});
		const stop = () => {
			video.pause();
			videoReady = false;
		};
		// Not for a finger, which taps straight to the theater, and not while
		// a board is being dragged past it.
		const enter = (event) => event.pointerType !== 'touch' && !event.buttons && play();
		const focus = () => button.matches(':focus-visible') && play();
		const blur = () => !card.matches(':hover') && stop();
		const off = [
			on(card, 'pointerenter', enter),
			on(card, 'pointerleave', stop),
			on(button, 'focus', focus),
			on(button, 'blur', blur)
		];
		return () => {
			for (const remove of off) remove();
			video.pause();
		};
	}
</script>

<article class="card" class:has-media={media && media.type !== 'code'}>
	<header>
		<h3 class="title">{entry.title}</h3>
		{#if entry.summary}<p class="summary">{entry.summary}</p>{/if}
	</header>

	{#if opens}
		<button
			type="button"
			class="media"
			class:wide={media.type === 'youtube' || media.type === 'video'}
			style:aspect-ratio={media.cardRatio ?? media.ratio ?? '16 / 9'}
			onclick={() => onopen?.(entry)}
			aria-label={playable ? `Play ${entry.title}` : `Look closer at ${entry.title}`}
		>
			{#if poster}
				<img src={poster} alt="" loading="lazy" decoding="async" />
			{/if}
			{#if media.type === 'video' && media.loop}
				<video
					class:ready={videoReady}
					src={media.loop}
					muted
					loop
					playsinline
					preload="none"
					disablepictureinpicture
					aria-hidden="true"
					onplaying={() => (videoReady = true)}
					{@attach media.playOn === 'hover' ? playOnHover : playWhileSeen}
				></video>
			{/if}
			{#if playable}
				<span class="play" aria-hidden="true">
					<svg viewBox="0 0 12 12"><path d="M3 1.8v8.4L10.2 6z" /></svg>
					{media.length ?? 'play'}
				</span>
			{/if}
		</button>
	{:else if media?.type === 'code'}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- our own snippets, escaped by highlight() -->
		<pre class="code"><code>{@html code}</code></pre>
	{/if}

	<footer>
		<span class="meta">
			{entry.kind}{#if entry.year}<span class="dot">·</span>{entry.year}{/if}
		</span>
		{#if links.length}
			<span class="links">
				{#each links as link (link.name)}
					<a href={link.href} class="tiny-link" target={link.target} rel={link.rel}
						>{link.name} {link.arrow}</a
					>
				{/each}
			</span>
		{/if}
	</footer>
</article>

<style>
	/* The ground the code on this site sits on: a card is a quiet block of it. */
	.card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-width: 0;
		height: 100%;
		padding: 1.125rem 1.125rem 1rem;
		border-radius: 1rem;
		background: var(--color-surface-muted);
	}

	header {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.title {
		margin: 0;
		color: var(--color-text-main);
		font-size: 1.0625rem;
		font-weight: 400;
		line-height: 1.3;
	}

	.summary {
		margin: 0;
		color: var(--color-text-muted);
		font-size: 0.9375rem;
		line-height: 1.5;
		text-wrap: pretty;
	}

	/* The picture runs nearly to the card's edges, as if laid on it. */
	.media {
		position: relative;
		display: block;
		width: calc(100% + 1.75rem);
		margin-inline: -0.875rem;
		overflow: hidden;
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--color-text-main) 6%, transparent);
		cursor: zoom-in;
	}

	.media.wide {
		cursor: pointer;
	}

	.media img,
	.media video {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* The clip fades in over its poster once it is really playing. */
	.media video {
		opacity: 0;
		transition: opacity 400ms ease;
	}

	.media video.ready {
		opacity: 1;
	}

	.media::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-text-main) 7%, transparent);
		pointer-events: none;
	}

	.play {
		position: absolute;
		left: 0.625rem;
		bottom: 0.625rem;
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.3rem 0.625rem 0.3rem 0.5rem;
		border-radius: 999px;
		background: rgb(12 10 9 / 0.62);
		color: #fff;
		font-family: var(--site-font-utility);
		font-size: 0.75rem;
		font-variant-numeric: tabular-nums;
		line-height: 1;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		transition: background-color 180ms ease;
	}

	.play svg {
		width: 0.625rem;
		height: 0.625rem;
		fill: currentColor;
	}

	.media:hover .play,
	.media:focus-visible .play {
		background: var(--color-accent);
	}

	/* Preflight gives <code> the site's mono, which is the utility face; code
	   on this site is set in the code face, so both elements say so. */
	.code,
	.code code {
		font-family: var(--site-font-code);
		font-variant-ligatures: none;
	}

	.code {
		margin: 0;
		padding: 0.875rem 0 0.125rem;
		border-top: 1px solid color-mix(in srgb, var(--color-text-main) 8%, transparent);
		color: var(--shiki-color-text);
		font-size: 0.75rem;
		line-height: 1.7;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.code :global(.tok-comment) {
		color: var(--shiki-token-comment);
	}

	.code :global(.tok-string) {
		color: var(--shiki-token-string);
	}

	.code :global(.tok-keyword) {
		color: var(--shiki-token-keyword);
	}

	.code :global(.tok-call) {
		color: var(--shiki-token-function);
	}

	.code :global(.tok-constant),
	.code :global(.tok-number) {
		color: var(--shiki-token-constant);
	}

	footer {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.25rem 1rem;
		margin-top: auto;
	}

	.meta {
		color: var(--color-text-faint);
		font-family: var(--site-font-utility);
		font-size: 0.75rem;
		letter-spacing: 0.04em;
	}

	.dot {
		margin-inline: 0.4em;
	}

	.links {
		display: flex;
		gap: 0.875rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.media video,
		.play {
			transition: none;
		}
	}
</style>
