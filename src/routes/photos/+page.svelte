<script>
	import Seo from '$components/general/seo.svelte';
	import { photoNotes } from '$lib/data/photos.js';
	import { siteOrigin, defaultSocialImage } from '$lib/js/config.js';

	let { data } = $props();

	const canonical = `${siteOrigin}/photos`;
	const photos = $derived(data.photos ?? []);

	function photoMeta(photo) {
		const coordinates =
			photo.latitude && photo.longitude
				? `${photo.latitude.toFixed(4)}, ${photo.longitude.toFixed(4)}`
				: undefined;

		return [photo.place ?? coordinates, photo.year].filter(Boolean).join(', ');
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

<section class="photos-shell">
	<header class="photos-intro">
		<p>{photoNotes.intro}</p>
	</header>

	{#if photos.length}
		<div class="photo-grid" aria-label="Photo gallery">
			{#each photos as photo (photo.src)}
				<figure class="photo-item">
					<img
						src={photo.src}
						alt={photo.alt}
						width={photo.width}
						height={photo.height}
						loading="lazy"
						decoding="async"
					/>
					<figcaption>
						{#if photoMeta(photo)}
							<span>{photoMeta(photo)}</span>
						{/if}
					</figcaption>
				</figure>
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<p class="eyebrow">/photos</p>
			<h1>{photoNotes.title}</h1>
			<p>{photoNotes.storageHint}</p>
		</div>
	{/if}
</section>

<style>
	.photos-shell {
		width: min(100%, 78rem);
		margin: 0 auto;
		padding: 9rem 1.5rem 6rem;
	}

	.photos-intro {
		min-height: 42vh;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: var(--color-text-main);
	}

	.photos-intro p {
		margin: 0;
		font-size: 0.95rem;
		color: var(--color-text-muted);
	}

	.photo-grid {
		column-count: 2;
		column-gap: 1.25rem;
	}

	.photo-item {
		break-inside: avoid;
		margin: 0 0 1.75rem;
	}

	.photo-item img {
		display: block;
		width: 100%;
		height: auto;
		background: var(--color-surface-muted);
	}

	.photo-item figcaption {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding-top: 0.45rem;
		color: var(--color-text-muted);
		font-size: 0.72rem;
		line-height: 1.2;
	}

	.photo-item figcaption span:last-child {
		text-align: right;
		color: color-mix(in srgb, var(--color-text-muted) 78%, transparent);
	}

	.empty-state {
		max-width: 34rem;
		margin: 0 auto;
		padding: 4rem 0 12rem;
		text-align: center;
		color: var(--color-text-muted);
	}

	.empty-state .eyebrow {
		margin: 0 0 0.5rem;
		color: var(--color-accent);
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.65rem;
		letter-spacing: 0.28em;
		text-transform: uppercase;
	}

	.empty-state h1 {
		margin: 0 0 0.75rem;
		color: var(--color-text-main);
		font-size: clamp(2rem, 8vw, 5.5rem);
		font-weight: 600;
		letter-spacing: -0.04em;
		line-height: 0.95;
	}

	.empty-state p:last-child {
		margin: 0 auto;
		max-width: 26rem;
		line-height: 1.7;
	}

	@media (max-width: 720px) {
		.photos-shell {
			padding-inline: 1rem;
			padding-top: 6rem;
		}

		.photos-intro {
			min-height: 34vh;
		}

		.photo-grid {
			column-count: 1;
		}

		.photo-item {
			margin-bottom: 1.35rem;
		}
	}
</style>
