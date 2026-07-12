<script>
	import Seo from '$components/general/seo.svelte';
	import { siteOrigin } from '$lib/js/config.js';
	import { onMount } from 'svelte';

	const FALLBACK_CARD = 'var(--color-accent)';

	let entries = $state([]);
	let loading = $state(true);
	let errorMessage = $state('');

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
		return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(
			new Date(date)
		);
	}

	function cardTheme(entry) {
		const color = typeof entry.cardColor === 'string' ? entry.cardColor : FALLBACK_CARD;
		return `--card-color:${color};`;
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
			{#each entries as entry (entry.id)}
				<article class="garden-card" style={cardTheme(entry)}>
					<div class="card-noise" aria-hidden="true"></div>
					<div class="card-copy">
						<p class="card-kicker">GUEST CARD</p>
						<div class="card-topline">
							<p class="card-name">{entry.name}</p>
							<time datetime={entry.createdAt}>{formatDate(entry.createdAt)}</time>
						</div>
						<p class="card-message">{entry.message}</p>
					</div>

					<div class="card-signature">
						{#if entry.signaturePaths?.length}
							<svg viewBox="0 0 520 132" aria-label={`Signature from ${entry.name}`}>
								{#each entry.signaturePaths as path, index (`${entry.id}-${index}`)}
									<path d={path}></path>
								{/each}
							</svg>
						{:else}
							<p class="legacy-signature">{entry.name}</p>
						{/if}
					</div>
				</article>
			{/each}
		</section>
	{/if}
</section>

<style>
	.garden-shell {
		width: min(100%, 78rem);
		margin: 0 auto;
		padding: 9rem 1.5rem 6rem;
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

	.hero-eyebrow {
		margin: 0 0 0.5rem;
		font-family: var(--font-visby);
		font-size: 0.7rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	h1 {
		margin: 0;
		font-family: var(--font-meri);
		font-size: clamp(2.2rem, 6vw, 4.9rem);
		font-style: italic;
		font-weight: 400;
		line-height: 0.98;
		letter-spacing: -0.04em;
		text-wrap: balance;
	}

	.hero-copy {
		margin: 1rem 0 0;
		font-size: 0.98rem;
		color: var(--color-text-muted);
		text-wrap: pretty;
	}

	.garden-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
		gap: 1.4rem;
		align-items: start;
		margin-top: 1rem;
	}

	.garden-card {
		--card-color: var(--color-accent);
		position: relative;
		min-height: 22rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 1.15rem 1.15rem 1rem;
		border-radius: 1.7rem;
		background:
			linear-gradient(180deg, rgb(255 255 255 / 12%), transparent 32%),
			linear-gradient(135deg, rgb(255 255 255 / 16%), rgb(255 255 255 / 0%)),
			linear-gradient(
				180deg,
				var(--card-color) 0%,
				color-mix(in srgb, var(--card-color) 93%, #ffffff) 100%
			);
		color: #ffffff;
		box-shadow:
			0 28px 50px rgba(255, 255, 255, 0.14),
			0 0 0 1px rgba(0, 0, 0, 0.08);
		overflow: hidden;
	}

	.card-noise {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image:
			url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='.12'%3E%3Crect x='1' y='2' width='1.2' height='1.2' rx='.2'/%3E%3Crect x='8' y='5' width='1.1' height='1.1' rx='.2'/%3E%3Crect x='14' y='1' width='1' height='1' rx='.2'/%3E%3Crect x='4' y='11' width='1.1' height='1.1' rx='.2'/%3E%3Crect x='11' y='13' width='1.2' height='1.2' rx='.2'/%3E%3Crect x='15' y='8' width='1' height='1' rx='.2'/%3E%3C/g%3E%3C/svg%3E"),
			linear-gradient(180deg, rgb(255 255 255 / 0.14), transparent 38%);
		background-size:
			18px 18px,
			100% 100%;
		opacity: 0.72;
		mix-blend-mode: multiply;
	}

	.card-copy,
	.card-signature {
		position: relative;
		z-index: 1;
	}

	.card-kicker {
		margin: 0;
		font-family: var(--font-visby);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		color: inherit;
		opacity: 0.74;
	}

	.card-topline {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
		margin-top: 0.85rem;
	}

	.card-name {
		margin: 0;
		font-family: var(--font-meri);
		font-size: 1.1rem;
		font-style: italic;
	}

	time {
		font-family: var(--font-visby);
		font-size: 0.74rem;
		color: rgba(255, 255, 255, 0.66);
		font-variant-numeric: tabular-nums;
	}

	.card-message {
		margin: 1rem 0 0;
		font-family: var(--font-meri);
		font-size: 1.15rem;
		font-style: italic;
		line-height: 1.5;
		white-space: pre-wrap;
		text-wrap: pretty;
	}

	.card-signature {
		margin-top: 1.5rem;
		padding-top: 1.1rem;
		border-top: 1px solid rgba(255, 255, 255, 0.18);
	}

	.card-signature svg {
		display: block;
		width: 100%;
		height: 6.75rem;
	}

	.card-signature path {
		fill: #ffffff;
	}

	.legacy-signature {
		margin: 1.6rem 0 0;
		font-family: var(--font-meri);
		font-size: 1.75rem;
		font-style: italic;
		color: rgba(255, 255, 255, 0.74);
	}

	@media (max-width: 640px) {
		.garden-shell {
			padding: 7rem 1rem 5rem;
		}

		.garden-hero {
			min-height: 26vh;
		}
	}
</style>
