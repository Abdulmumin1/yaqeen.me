<script>
	import Seo from '$components/general/seo.svelte';
	import { photoNotes } from '$lib/data/photos.js';
	import { siteOrigin, defaultSocialImage } from '$lib/js/config.js';

	let { data } = $props();

	const canonical = `${siteOrigin}/photos`;
	const photos = $derived(data.photos ?? []);

	/* The edges of the window go soft: eight layers, each blurred twice as
	   much as the one before, each showing through a band an eighth of the
	   way further along. Together they ramp from sharp to 10px. */
	const blurLayers = Array.from({ length: 8 }, (_, index) => {
		const at = (step) => `${step * 12.5}%`;
		return {
			blur: `blur(${0.078125 * 2 ** index}px)`,
			stops: `transparent ${at(index)}, #000 ${at(index + 1)}, #000 ${at(index + 2)}, transparent ${at(index + 3)}`
		};
	});

	// The top edge only softens once the nav has scrolled away, and the bottom
	// one lets go when the photos run out, so neither blurs the nav or footer.
	let scrollY = $state(0);
	let reachedEnd = $state(false);
	const softTop = $derived(scrollY > 120);
	const softBottom = $derived(!reachedEnd);

	function watchEnd(node) {
		const observer = new IntersectionObserver(([entry]) => {
			reachedEnd = entry.isIntersecting || entry.boundingClientRect.top < 0;
		});
		observer.observe(node);
		return () => observer.disconnect();
	}

	// A photo that is still on its way fades in when it lands. One that is
	// already there (cached, or loaded before the page woke up) just shows.
	function fadeInOnLoad(img) {
		if (img.complete) return;
		img.classList.add('is-loading');
		const done = () => img.classList.remove('is-loading');
		img.addEventListener('load', done, { once: true });
		img.addEventListener('error', done, { once: true });
		return () => {
			img.removeEventListener('load', done);
			img.removeEventListener('error', done);
		};
	}
</script>

<svelte:head>
	<Seo
		title="Photos | Abdulmumin Yaqeen"
		description="A small set of photos by Abdulmumin Yaqeen."
		{canonical}
		image={defaultSocialImage}
	/>
</svelte:head>

<svelte:window bind:scrollY />

<section class="photos-page page-column">
	<header class="photos-intro type-small">
		<h1 class="sr-only">{photoNotes.title}</h1>
		<p>{photoNotes.intro}</p>
	</header>

	{#if photos.length}
		<!-- One column, hung from the right edge of the page, like the last item in the nav.
		     Just the photos: no captions, no dates. -->
		<div class="photo-stack" aria-label="Photo gallery">
			{#each photos as photo, index (photo.key)}
				<div class="frame">
					<img
						src={photo.src}
						alt={photo.alt}
						width={photo.width}
						height={photo.height}
						loading={index < 2 ? 'eager' : 'lazy'}
						fetchpriority={index === 0 ? 'high' : undefined}
						decoding="async"
						{@attach fadeInOnLoad}
					/>
				</div>
			{/each}
		</div>
		<div class="stack-end" aria-hidden="true" {@attach watchEnd}></div>
	{:else}
		<div class="empty-state">
			<p class="type-small">{photoNotes.storageHint}</p>
		</div>
	{/if}
</section>

{#if photos.length}
	<div class="soft-edge soft-edge-top" class:visible={softTop} aria-hidden="true">
		{#each blurLayers as layer, index (index)}
			<div
				style:backdrop-filter={layer.blur}
				style:-webkit-backdrop-filter={layer.blur}
				style:mask-image={`linear-gradient(to top, ${layer.stops})`}
				style:-webkit-mask-image={`linear-gradient(to top, ${layer.stops})`}
			></div>
		{/each}
	</div>
	<div class="soft-edge soft-edge-bottom" class:visible={softBottom} aria-hidden="true">
		{#each blurLayers as layer, index (index)}
			<div
				style:backdrop-filter={layer.blur}
				style:-webkit-backdrop-filter={layer.blur}
				style:mask-image={`linear-gradient(to bottom, ${layer.stops})`}
				style:-webkit-mask-image={`linear-gradient(to bottom, ${layer.stops})`}
			></div>
		{/each}
	</div>
{/if}

<style>
	.photos-page {
		padding-top: var(--page-top);
		padding-bottom: 4rem;
	}

	.photos-intro {
		color: var(--color-text-faint);
	}

	.photos-intro p {
		margin: 0;
	}

	/* The first photo starts well down the window, with nothing but air above it. */
	.photo-stack {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: min(30rem, 100%);
		margin-top: max(3rem, calc(40vh - 9rem));
		margin-left: auto;
		animation: stack-appear 500ms ease both;
	}

	/* Every photo is cut to the same 3:4, so the column reads as one strip. */
	.frame {
		position: relative;
		aspect-ratio: 3 / 4;
		overflow: hidden;
		background: var(--color-surface-muted);
	}

	/* A hairline, drawn over the photo rather than around it, so pale skies
	   still have an edge. */
	.frame::after {
		content: '';
		position: absolute;
		inset: 0;
		border: 1px solid color-mix(in srgb, var(--color-text-main) 6%, transparent);
		pointer-events: none;
	}

	.frame img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		transition: opacity 500ms ease;
	}

	.frame :global(img.is-loading) {
		opacity: 0;
	}

	.stack-end {
		height: 1px;
	}

	.empty-state {
		margin-top: max(3rem, calc(40vh - 9rem));
		max-width: 26rem;
		color: var(--color-text-muted);
	}

	.empty-state p {
		margin: 0;
	}

	/* The soft edges: fixed to the top and bottom of the window, over the photos. */
	.soft-edge {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 20;
		height: 108px;
		overflow: hidden;
		pointer-events: none;
		opacity: 0;
		transition: opacity 300ms ease;
	}

	.soft-edge.visible {
		opacity: 1;
	}

	.soft-edge-top {
		top: 0;
	}

	.soft-edge-bottom {
		bottom: 0;
	}

	.soft-edge > div {
		position: absolute;
		inset: 0;
	}

	/* Like jrhu.me, the soft edges are for bigger screens; on a phone they
	   cost more than they give. */
	@media (width < 48rem) {
		.soft-edge {
			display: none;
		}
	}

	@media (prefers-reduced-transparency: reduce) {
		.soft-edge {
			display: none;
		}
	}

	@keyframes stack-appear {
		from {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.photo-stack {
			animation: none;
		}

		.frame img {
			transition: none;
		}
	}
</style>
