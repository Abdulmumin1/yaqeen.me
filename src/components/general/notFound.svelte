<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { loadAtlas } from '$lib/butterfly/habitat.js';
	import { createSwarm } from '$lib/butterfly/swarm.js';

	/**
	 * The 404: the missing page's number, made of monarchs.
	 *
	 * They fly in from every side to spell it, scatter from the cursor and come
	 * back to their places, all lift off at a click or when the lights change,
	 * and a few go and sit on the way home when you reach for it. Leave the
	 * cursor still for long enough and one may come and sit on that. All of it
	 * is in $lib/butterfly/swarm.js; this is the page they do it on.
	 */

	const TILTS = [-0.09, 0.03, 0.11]; // how each digit leans, radians: set down by hand

	// Top-level pages, for guessing what a mistyped address meant.
	const ROUTES = [
		'blog',
		'projects',
		'garden',
		'work',
		'photos',
		'about',
		'drop',
		'braintime',
		'neuroodyssey',
		'css-faster'
	];

	let stage = $state(null);
	let canvas = $state(null);
	let shown = $state(false);
	let failed = $state(false);
	let swarm = null;

	const suggestion = $derived(guess(page.url.pathname));

	/** The top-level page the address most likely meant, if it is close to one. */
	function guess(pathname) {
		const parts = pathname.split('/').filter(Boolean);
		const first = parts[0]?.toLowerCase();
		if (!first) return null;
		// The right section, a missing page in it: /blog/no-such-post.
		if (ROUTES.includes(first)) return parts.length > 1 ? `/${first}` : null;
		let best = ROUTES[0];
		let nearest = Infinity;
		for (const route of ROUTES) {
			const distance = apart(first, route);
			if (distance < nearest) [best, nearest] = [route, distance];
		}
		return nearest <= Math.max(1, Math.floor(best.length / 4)) ? `/${best}` : null;
	}

	/** How many letters have to change to get from one word to the other. */
	function apart(a, b) {
		let row = Array.from({ length: b.length + 1 }, (_, n) => n);
		for (let i = 1; i <= a.length; i += 1) {
			const next = [i];
			for (let j = 1; j <= b.length; j += 1) {
				const swap = row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);
				next[j] = Math.min(next[j - 1] + 1, row[j] + 1, swap);
			}
			row = next;
		}
		return row[b.length];
	}

	onMount(() => {
		let stopped = false;
		const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const root = getComputedStyle(document.documentElement);
		const font = root.getPropertyValue('--site-font-display').trim() || 'sans-serif';

		Promise.all([loadAtlas(), document.fonts.load(`800 100px ${font}`).catch(() => null)])
			.then(([atlas]) => {
				if (stopped) return;
				const onShow = () => (shown = true);
				swarm = createSwarm({
					canvas,
					stage,
					atlas,
					text: '404',
					font,
					tilts: TILTS,
					still,
					onShow
				});
				if (!swarm) failed = true;
			})
			.catch(() => !stopped && (failed = true));

		return () => {
			stopped = true;
			swarm?.destroy();
			swarm = null;
		};
	});
</script>

<svelte:head>
	<title>404 · This page flew away</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="page">
	<!-- Where the swarm spells the number. Without it (no script, nothing to draw with), the plain number. -->
	<div bind:this={stage} class="stage" aria-hidden="true">
		<span class="plain" class:failed class:shown>404</span>
	</div>

	<h1 class="type-title text-text-main text-balance">
		<span class="sr-only">404. </span>This page flew away.
	</h1>

	<p class="exits type-ui">
		<a
			class="link"
			href={resolve('/')}
			onpointerenter={(event) => swarm?.accompany(event.currentTarget)}
			onpointerleave={() => swarm?.dismiss()}
			onfocus={(event) => swarm?.accompany(event.currentTarget)}
			onblur={() => swarm?.dismiss()}>Take me home</a
		>
		{#if suggestion}
			<span class="text-text-faint">or maybe</span>
			<a class="link" href={resolve(suggestion)}>{suggestion}</a>
		{/if}
	</p>
</section>

<canvas bind:this={canvas} class="swarm" aria-hidden="true"></canvas>

<style>
	.stage {
		position: relative;
		height: clamp(9rem, 40vw, 15rem);
		margin-bottom: 1.5rem;
		/* The ink of the dashed outline the butterflies sit in. */
		color: var(--color-text-faint);
	}

	.plain {
		display: none;
		position: absolute;
		inset: 0;
		align-items: center;
		color: var(--color-text-main);
		font-family: var(--site-font-display);
		font-size: clamp(7rem, 30vw, 12.5rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: 0.02em;
	}

	.plain.failed {
		display: flex;
	}

	@media (scripting: none) {
		.plain {
			display: flex;
		}
	}

	.plain.shown {
		display: none;
	}

	.exits {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.swarm {
		position: fixed;
		inset: 0;
		z-index: 30;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	@media print {
		.swarm {
			display: none;
		}

		.plain,
		.plain.shown {
			display: flex;
		}
	}
</style>
