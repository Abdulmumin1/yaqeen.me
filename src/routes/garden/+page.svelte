<script>
	import Seo from '$components/general/seo.svelte';
	import { siteOrigin } from '$lib/js/config.js';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	let entries = $state([]);
	let loading = $state(true);
	let errorMessage = $state('');
	const masonryColumns = $derived.by(() => buildMasonry(entries, 4));
	const markStyles = [
		{ rotate: '-4.5deg', ink: 'var(--color-1-ink)', muted: 'var(--color-1-muted)', width: '16rem' },
		{ rotate: '3.2deg', ink: 'var(--color-2-ink)', muted: 'var(--color-2-muted)', width: '13rem' },
		{ rotate: '-6deg', ink: 'var(--color-3-ink)', muted: 'var(--color-3-muted)', width: '10rem' },
		{ rotate: '5.5deg', ink: 'var(--color-4-ink)', muted: 'var(--color-4-muted)', width: '19rem' },
		{ rotate: '-2.8deg', ink: 'var(--color-5-ink)', muted: 'var(--color-5-muted)', width: '12rem' },
		{ rotate: '7deg', ink: 'var(--color-6-ink)', muted: 'var(--color-6-muted)', width: '15rem' },
		{ rotate: '-8deg', ink: 'var(--color-7-ink)', muted: 'var(--color-7-muted)', width: '11rem' }
	];

	onMount(async () => {
		try {
			const response = await fetch('/api/guestbook');
			if (!response.ok) throw new Error('The garden is taking a breather.');
			entries = await response.json();
		} catch (error) {
			errorMessage = error.message;
		} finally {
			loading = false;
		}
	});

	function formatDate(date) {
		return new Intl.DateTimeFormat(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		})
			.format(new Date(date))
			.toUpperCase();
	}

	function estimateMarkHeight(entry) {
		const messageLength = typeof entry.message === 'string' ? entry.message.length : 0;
		const nameLength = typeof entry.name === 'string' ? entry.name.length : 0;
		return 7 + Math.ceil(nameLength / 9) * 2.2 + Math.ceil(messageLength / 34) * 1.2;
	}

	function buildMasonry(items, count) {
		const columns = Array.from({ length: count }, () => ({ height: 0, items: [] }));

		items.forEach((entry, index) => {
			const shortest = columns.reduce(
				(best, column, columnIndex) => (column.height < columns[best].height ? columnIndex : best),
				0
			);
			columns[shortest].items.push({ entry, index, style: markStyle(index) });
			columns[shortest].height += estimateMarkHeight(entry) + 1.6;
		});

		return columns.map((column) => column.items);
	}

	function markStyle(index) {
		const style = markStyles[index % markStyles.length];
		return `--rotate:${style.rotate};--ink:${style.ink};--ink-muted:${style.muted};--mark-width:${style.width};`;
	}
</script>

<svelte:head>
	<Seo
		title="Garden | Abdulmumin Yaqeen"
		description="Signed guest cards left by visitors."
		canonical={`${siteOrigin}/garden`}
		robots="noindex, follow"
	/>
</svelte:head>

<section class="garden-shell">
	<header class="garden-hero">
		{#if loading}
			<p class="hero-copy">opening the gate…</p>
		{:else if errorMessage}
			<p class="hero-copy">{errorMessage}</p>
		{:else if entries.length === 0}
			<p class="hero-copy">The garden is quiet for now. Be the first to leave a trace.</p>
		{:else}
			<div class="hero-stack">
				<p>The moon leaves receipts... from every one that found their way</p>
			</div>
		{/if}
	</header>

	{#if entries.length > 0}
		<section class="garden-grid" aria-label="Guestbook notes">
			{#each masonryColumns as column, columnIndex (`column-${columnIndex}`)}
				<div class="garden-column">
					{#each column as mark (mark.entry.id)}
						<article class="graffiti-mark" style={mark.style}>
							<time datetime={mark.entry.createdAt} class="mark-stamp"
								>{formatDate(mark.entry.createdAt)}</time
							>

							<p class="mark-name">{mark.entry.name}</p>

							{#if mark.entry.message}
								<p class="mark-message">{mark.entry.message}</p>
							{/if}

							<div class="mark-signature">
								{#if mark.entry.signaturePaths?.length}
									<svg viewBox="0 0 520 132" aria-label={`Signature from ${mark.entry.name}`}>
										{#each mark.entry.signaturePaths as path, index (`${mark.entry.id}-${index}`)}
											<path d={path}></path>
										{/each}
									</svg>
								{:else}
									<p class="legacy-signature">{mark.entry.name}</p>
								{/if}
							</div>
						</article>
					{/each}
				</div>
			{/each}
		</section>

		<div class="garden-butterfly-bar">
			<video
				class="garden-butterfly"
				src={resolve('/butterflies-loop.webm')}
				autoplay
				muted
				loop
				playsinline
				preload="metadata"
				aria-hidden="true"
			></video>
		</div>
	{/if}
</section>

<style>
	.garden-shell {
		width: min(100%, 78rem);
		margin: 0 auto;
		padding: 9rem 1.5rem 6rem;
	}

	.garden-butterfly-bar {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		margin-top: 4rem;
		padding: 6rem 0 4rem;
	}

	.garden-butterfly {
		position: absolute;
		z-index: 0;
		inset: -2rem 0;
		width: 100%;
		height: calc(100% + 4rem);
		object-fit: cover;
		object-position: center 35%;
		opacity: 0.48;
		pointer-events: none;
		filter: hue-rotate(-12deg) saturate(1.5) brightness(1.08);
	}

	.garden-hero {
		min-height: 32vh;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: var(--color-text-main);
	}

	.hero-stack {
		max-width: 38rem;
	}

	.hero-copy {
		margin: 1rem 0 0;
		font-size: 0.98rem;
		color: var(--color-text-muted);
		text-wrap: pretty;
	}

	.garden-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		align-items: start;
		gap: 0.25rem 1rem;
		margin-top: 1rem;
	}

	.garden-column {
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: center;
		gap: 1.15rem;
	}

	.garden-column:nth-child(2n) {
		padding-top: 3.5rem;
	}

	.garden-column:nth-child(3n) {
		padding-top: 1.4rem;
	}

	.graffiti-mark {
		--color-1-ink: #385947;
		--color-1-muted: rgb(56 89 71 / 0.48);
		--color-2-ink: #6f98bf;
		--color-2-muted: rgb(111 152 191 / 0.55);
		--color-3-ink: #ee5d2f;
		--color-3-muted: rgb(238 93 47 / 0.48);
		--color-4-ink: #9c92c9;
		--color-4-muted: rgb(156 146 201 / 0.55);
		--color-5-ink: #221f1f;
		--color-5-muted: rgb(34 31 31 / 0.52);
		--color-6-ink: #385947;
		--color-6-muted: rgb(56 89 71 / 0.42);
		--color-7-ink: #6f98bf;
		--color-7-muted: rgb(111 152 191 / 0.5);

		--ink: var(--color-5-ink);
		--ink-muted: var(--color-5-muted);
		--rotate: 0deg;
		--mark-width: 12rem;
		width: min(100%, var(--mark-width));
		padding: 0.5rem 0.4rem 0.6rem;
		transform: rotate(var(--rotate));
		transition: transform 0.18s ease;
		color: var(--ink);
	}

	:global(.dark) .graffiti-mark {
		--color-1-ink: #72a386;
		--color-1-muted: rgba(114, 163, 134, 0.6);
		--color-2-ink: #8ab7e5;
		--color-2-muted: rgba(138, 183, 229, 0.6);
		--color-3-ink: #f0744d;
		--color-3-muted: rgba(240, 116, 77, 0.6);
		--color-4-ink: #beb4eb;
		--color-4-muted: rgba(190, 180, 235, 0.6);
		--color-5-ink: #d4d4d8;
		--color-5-muted: rgba(212, 212, 216, 0.6);
		--color-6-ink: #72a386;
		--color-6-muted: rgba(114, 163, 134, 0.5);
		--color-7-ink: #8ab7e5;
		--color-7-muted: rgba(138, 183, 229, 0.55);
	}

	.mark-stamp {
		font-family: var(--font-visby);
		font-size: 0.5rem;
		font-weight: 800;
		letter-spacing: 0.14em;
		color: var(--ink-muted);
		font-variant-numeric: tabular-nums;
		display: block;
		margin-bottom: 0.25rem;
	}

	.graffiti-mark:hover {
		transform: rotate(0deg) scale(1.04);
		z-index: 2;
		position: relative;
	}

	.mark-name {
		margin: 0;
		font-family: var(--font-pixel);
		font-size: clamp(2rem, 6vw, 3.8rem);
		line-height: 1.15;
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	.mark-message {
		margin: 0.35rem 0 0;
		max-width: 11rem;
		font-family: var(--font-visby);
		font-size: 0.88rem;
		line-height: 1.35;
		word-break: break-all;
		overflow-wrap: anywhere;
		color: var(--ink-muted);
		white-space: pre-wrap;
		text-wrap: pretty;
	}

	.mark-signature {
		min-width: 0;
		margin-top: 0.7rem;
	}

	.mark-signature svg {
		display: block;
		width: 100%;
		height: 2.2rem;
	}

	.mark-signature path {
		fill: currentColor;
	}

	.legacy-signature {
		margin: 0;
		font-family: var(--font-pixel);
		font-size: 1rem;
		color: var(--ink-muted);
	}

	@media (max-width: 640px) {
		.garden-shell {
			padding: 7rem 1rem 5rem;
		}

		.garden-hero {
			min-height: 26vh;
		}

		.garden-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0.5rem;
		}

		.garden-column,
		.garden-column:nth-child(2n),
		.garden-column:nth-child(3n) {
			padding-top: 0;
		}

		.mark-name {
			font-size: clamp(1.6rem, 6vw, 2.6rem);
		}

		.graffiti-mark {
			width: min(100%, var(--mark-width));
			margin-left: 0 !important;
			margin-right: 0 !important;
			margin-top: 0 !important;
		}

		.mark-message {
			font-size: 0.78rem;
			max-width: 9rem;
		}
	}
</style>
