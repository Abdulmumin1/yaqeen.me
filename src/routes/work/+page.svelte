<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { beforeNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Seo from '../../components/general/seo.svelte';
	import DitherField from '../../components/general/ditherField.svelte';
	import { project_data, sass_projects } from '$lib/utils/projectStore.js';

	const favoriteNames = ['Chump', 'ai-query.dev', 'Owostack', 'Thirdpen'];
	const projects = $derived([...$sass_projects, ...$project_data]);
	const favorites = $derived(
		favoriteNames.map((name) => projects.find((project) => project.name === name)).filter(Boolean)
	);
	const otherProjects = $derived(
		projects.filter((project) => !favoriteNames.includes(project.name))
	);

	function linkFor(project) {
		const link = project.links.page || project.links.study;
		if (link?.startsWith('/')) return resolve(link);
		return link?.startsWith('http') ? link : `https://${link}`;
	}

	function videoFor(project) {
		if (project.name === 'Chump') return 'B7cCCHSHM-k';
		if (project.name === 'Owostack') return 'vVq5Qrd2Qmc';
		if (project.name === 'Thirdpen') return 'C6RJ8lcIKs4';
		if (project.name == 'ai-query.dev') return "RMmiLAX0kxc";
	}

	function thumbnailFor(videoId) {
		return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
	}

	// Press play and the house lights go down: the page dims to a slow dither in
	// that product's colours until the video stops or you scroll on.
	const rooms = {
		Chump: {
			pattern: 'rings',
			matrix: 4,
			ramp: ['#0c0a09', '#14180a', '#232a10', '#3c4715', '#5d6917']
		},
		'ai-query.dev': {
			pattern: 'clouds',
			matrix: 4,
			ramp: ['#0c0a09', '#1a071f', '#310a3a', '#551062', '#86198f']
		},
		Owostack: {
			pattern: 'bands',
			matrix: 2,
			ramp: ['#0c0a09', '#3a1512', '#4a300f', '#12382a', '#0c0a09']
		},
		Thirdpen: {
			pattern: 'clouds',
			matrix: 4,
			ramp: ['#06080f', '#0a1230', '#102d63', '#0b5680', '#0f84b8']
		}
	};

	let containerNode = $state(null);
	let rowNode = $state(null);
	let activeSlide = $state(0);
	let playingProject = $state(null);
	let cleanupWorkScroll = () => {};
	let scroller = null;
	const slideCount = $derived(favorites.length + 2);
	const room = $derived(playingProject ? rooms[playingProject] : null);

	// Scrolls to wherever the strip has this slide in the middle of the window.
	function goTo(index) {
		if (!scroller || !rowNode) return;
		const slides = rowNode.querySelectorAll('.work-slide');
		const slide = slides[Math.min(Math.max(index, 0), slides.length - 1)];
		const distance = Math.max(rowNode.scrollWidth - window.innerWidth, 0);
		const offset = slide.getBoundingClientRect().left - rowNode.getBoundingClientRect().left;
		const centred = offset + slide.offsetWidth / 2 - window.innerWidth / 2;
		const progress = distance ? Math.min(Math.max(centred / distance, 0), 1) : 0;
		window.scrollTo({
			top: scroller.start + progress * (scroller.end - scroller.start),
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
		});
	}

	function onKeydown(event) {
		if (event.key === 'Escape' && playingProject) {
			playingProject = null;
			return;
		}
		// Arrow keys step through the strip, but only while it is the thing on screen.
		if (!scroller || window.scrollY >= scroller.end) return;
		if (event.metaKey || event.ctrlKey || event.altKey) return;
		if (event.target.closest?.('input, textarea, select, [contenteditable]')) return;
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			goTo(activeSlide + 1);
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			goTo(activeSlide - 1);
		}
	}

	beforeNavigate(() => {
		cleanupWorkScroll();
	});

	onMount(() => {
		if (!containerNode || !rowNode) return;

		let animation;
		let context;
		let cleanedUp = false;

		function cleanup() {
			if (cleanedUp) return;
			cleanedUp = true;
			scroller = null;
			animation?.scrollTrigger?.kill(true);
			animation?.kill();
			context?.revert();
			gsap.set(rowNode, { clearProps: 'all' });
			gsap.set(containerNode, { clearProps: 'all' });
			cleanupWorkScroll = () => {};
		}
		const mobileQuery = window.matchMedia('(max-width: 700px)');
		if (mobileQuery.matches) {
			cleanupWorkScroll = cleanup;
			return cleanup;
		}

		gsap.registerPlugin(ScrollTrigger);

		context = gsap.context(() => {
			const slideDistance = () => Math.max(rowNode.scrollWidth - window.innerWidth, 0);

			animation = gsap.to(rowNode, {
				x: () => -slideDistance(),
				ease: 'none',
				scrollTrigger: {
					id: 'work-horizontal-scroll',
					trigger: containerNode,
					start: 'top top',
					end: () => `+=${slideDistance()}`,
					pin: true,
					scrub: true,
					onUpdate: (self) => {
						const rawIndex = self.progress * (slideCount - 1);
						const newSlide = Math.min(
							Math.max(Math.round(rawIndex), 0),
							slideCount - 1
						);
						if (newSlide !== activeSlide) {
							activeSlide = newSlide;
							playingProject = null;
						}
					},
					onLeave: () => (playingProject = null),
					onLeaveBack: () => (playingProject = null),
					invalidateOnRefresh: true,
					anticipatePin: 1
				}
			});
			scroller = animation.scrollTrigger;
		}, containerNode);

		cleanupWorkScroll = cleanup;
		return cleanup;
	});
</script>

<svelte:head>
	<Seo title="Work" description="A few products and experiments built by Abdulmumin Yaqeen." />
</svelte:head>

<svelte:window onkeydown={onKeydown} />

<div bind:this={containerNode} class="horizontal-scene" class:theater={playingProject}>
	{#if playingProject && room}
		<button
			type="button"
			class="house-lights"
			aria-label="Stop the video and bring the lights back up"
			onclick={() => (playingProject = null)}
			transition:fade={{ duration: 320 }}
		>
			<DitherField pattern={room.pattern} ramp={room.ramp} matrix={room.matrix} seed={4} />
		</button>
	{/if}

	<div class="work-progress">
		{#each Array.from({ length: slideCount }, (_, index) => index) as index (index)}
			<button
				type="button"
				class:active={index === activeSlide}
				aria-label={`Go to slide ${index + 1} of ${slideCount}`}
				aria-current={index === activeSlide ? 'true' : undefined}
				onclick={() => goTo(index)}
			></button>
		{/each}
	</div>


	<div class="horizontal-pin">
		<div bind:this={rowNode} class="horizontal-track">
			<!-- The words that open the strip sit in the page column, in the same type as the
			     intro on the home page: /work begins where every other page begins. -->
			<article class="work-slide intro-slide opening" data-slide-index={0}>
				<p class="intro-text type-lead text-balance">
					I’ve spent 4+ years doing product engineering at
					<a class="link" href="https://cloudplexo.com" target="_blank" rel="noopener noreferrer"
						>CloudPlexo</a
					>, leading a team of 3 to build
					<a class="link" href="https://agentspec.ai" target="_blank" rel="noopener noreferrer"
						>AgentSpec.ai</a
					>,
					<a class="link" href="https://wendu.io" target="_blank" rel="noopener noreferrer"
						>Wendu.io</a
					>, and
					<a class="link" href="https://checkitme.com" target="_blank" rel="noopener noreferrer"
						>Checkitme.com</a
					>. I’m a product engineer, rooted in doing infra for agents. I would also say I have a
					good eye for design.
				</p>
			</article>
			{#each favorites as project, index (project.name)}
				{@const videoId = videoFor(project)}
				<article
					class="work-slide project-slide slide-{index + 1}"
					class:playing={playingProject === project.name}
					data-slide-index={index + 1}
				>
					<div class="project-meta">
						{#if project.links?.page || project.links?.study}
							<a href={linkFor(project)} target="_blank" rel="noopener noreferrer" class="project-title-link">
								{project.name}
							</a>
						{:else}
							<span>{project.name}</span>
						{/if}
						<span>{project.year}</span>
					</div>
					<a
						href={linkFor(project)}
						target="_blank"
						rel="noopener noreferrer"
						class="project-media"
						onclick={(event) => {
							event.preventDefault();
							if (videoId) {
								playingProject = playingProject === project.name ? null : project.name;
							}
						}}
					>
						{#if videoId && playingProject === project.name}
							<iframe
								src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=1`}
								title={project.name}
								class="project-video"
								allow="autoplay; encrypted-media"
								allowfullscreen
							></iframe>
						{:else if videoId}
							<img
								src={thumbnailFor(videoId)}
								alt={`${project.name} preview`}
								class="project-image"
								loading="lazy"
							/>
							<div class="play-badge" aria-hidden="true">
								<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
									<polygon points="5 3 19 12 5 21 5 3" />
								</svg>
							</div>
						{:else if project.imagelist?.[0]}
							<img
								src={project.imagelist[0]}
								alt={`${project.name} preview`}
								class="project-image"
								loading="lazy"
							/>
						{/if}
						{#if playingProject !== project.name}
							<div class="project-overlay">
								<p>{project.description}</p>
							</div>
						{/if}
					</a>
				</article>
			{/each}
			<article class="work-slide intro-slide closing" data-slide-index={favorites.length + 1}>
				<p class="intro-text type-lead text-balance">
					I'm a bit of open source guy and i do it from time to time. I’ve made contributions to
					notable projects like
					<a
						class="link"
						href="https://github.com/sveltejs/svelte"
						target="_blank"
						rel="noopener noreferrer">Svelte</a
					>,
					<a
						class="link"
						href="https://github.com/pydantic/pydantic"
						target="_blank"
						rel="noopener noreferrer">Pydantic</a
					>,
					<a
						class="link"
						href="https://github.com/huntabyte/shadcn-svelte"
						target="_blank"
						rel="noopener noreferrer">shadcn-svelte</a
					>,
					<a
						class="link"
						href="https://github.com/hookdeck/outpost"
						target="_blank"
						rel="noopener noreferrer">Outpost</a
					>, and
					<a
						class="link"
						href="https://github.com/flet-dev/flet"
						target="_blank"
						rel="noopener noreferrer">Flet</a
					>. I used to run a
					<a
						class="link"
						href="https://youtube.com/abdulmuminyqn"
						target="_blank"
						rel="noopener noreferrer">youtube channel</a
					> a few years ago
				</p>
			</article>
		</div>
	</div>
</div>

<!-- Everything else, in the same kind of list as the writing on the home page:
     a name to a row, with its year hanging in the margin. A row opens to say more. -->
<div class="page">
	<section aria-labelledby="all-projects-heading">
		<h2 id="all-projects-heading" class="section-heading">More projects</h2>
		<div class="row-list">
			{#each otherProjects as project (project.name)}
				<details class="more-row">
					<summary class="hang-row type-list">
						<span class="hang-meta">{project.year}</span>
						<span class="more-name row-link">{project.name}</span>
					</summary>
					<div class="more-body">
						<p class="type-ui text-text-muted">{project.description}</p>
						<a class="tiny-link" href={linkFor(project)} target="_blank" rel="noopener noreferrer">
							open project →
						</a>
					</div>
				</details>
			{/each}
			<a
				class="tiny-link self-start"
				href="https://github.com/Abdulmumin1"
				target="_blank"
				rel="noopener noreferrer"
			>
				more on github →
			</a>
		</div>
	</section>
</div>

<style>
	.horizontal-scene {
		position: relative;
		background: var(--color-surface);
	}

	.project-meta {
		font-family: var(--site-font-utility);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.intro-slide {
		display: flex;
		align-items: center;
	}

	/* The page column, measured from the strip itself (100cqw is its width, with
	   no scrollbar in it) so the words line up with the nav above them. */
	.intro-slide.opening {
		width: max(min(76vw, 68rem), calc((100cqw + 39rem) / 2 + 3rem));
		padding-left: max(1.5rem, calc((100cqw - 39rem) / 2));
		padding-right: 3rem;
	}

	/* At the far end the strip stops with these words in the column again. */
	.intro-slide.closing {
		width: calc((100cqw + 39rem) / 2);
		min-width: 22rem;
		padding-right: max(1.5rem, calc((100cqw - 39rem) / 2));
	}

	.intro-text {
		max-width: 39rem;
		margin: 0;
		color: var(--color-text-main);
	}

	.horizontal-pin {
		position: relative;
		z-index: 2;
		height: 100vh;
		width: 100%;
		overflow: hidden;
		container-type: inline-size;
		will-change: transform;
	}

	/* Lights down: while a video plays, everything else recedes into its colours. */
	.house-lights {
		position: fixed;
		inset: 0;
		z-index: 1;
		padding: 0;
		border: 0;
		background: #0c0a09;
		cursor: default;
		overflow: hidden;
	}

	.theater .work-slide:not(.playing) {
		opacity: 0.05;
		pointer-events: none;
	}

	.theater .project-meta,
	.theater .project-title-link {
		color: rgb(245 245 244 / 0.7);
	}

	/* No bright flash of page colour while the player loads. */
	.playing .project-media {
		border-color: transparent;
		background: #0c0a09;
	}

	.theater .work-progress {
		opacity: 0;
		pointer-events: none;
	}

	.work-progress {
		position: absolute;
		top: clamp(2rem, 5vw, 4rem);
		left: 50%;
		transform: translateX(-50%);
		z-index: 4;
		display: flex;
		gap: 0.38rem;
		align-items: center;
		transition: opacity 0.2s ease;
	}

	.work-progress button {
		position: relative;
		width: 1px;
		height: 1.1rem;
		padding: 0;
		border: 0;
		background: var(--color-text-muted);
		opacity: 0.55;
		cursor: pointer;
		transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, opacity 0.2s ease;
	}

	/* A tick is a hair wide; this gives it something to click. */
	.work-progress button::before {
		content: '';
		position: absolute;
		inset: -0.6rem -0.19rem;
	}

	.work-progress button.active {
		width: 1.6rem;
		height: 0.9rem;
		border: 1px solid var(--color-text-muted);
		background: transparent;
		opacity: 1;
		transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, opacity 0.2s ease;
	}

	.horizontal-track {
		display: flex;
		align-items: center;
		gap: clamp(0.25rem, 0.75vw, 0.75rem);
		width: max-content;
		height: 100vh;
		will-change: transform;
	}

	.work-slide {
		width: min(76vw, 68rem);
		height: min(72vh, 42rem);
		flex: none;
		transition: opacity 0.32s ease;
	}

	.project-meta {
		display: flex;
		justify-content: space-between;
		color: var(--color-text-muted);
	}

	.project-title-link {
		color: var(--color-text-muted);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.project-title-link:hover {
		color: var(--color-accent);
		text-decoration: underline;
	}

	.project-slide {
		display: grid;
		grid-template-columns: minmax(1rem, 1fr) minmax(20rem, 60rem) minmax(1rem, 1fr);
		grid-template-rows: 1fr auto auto 1fr;
		align-items: center;
		padding-inline: clamp(1rem, 4vw, 4rem);
	}

	.project-meta {
		grid-column: 2;
		grid-row: 2;
		margin-bottom: 0.75rem;
		padding-inline: 0.25rem;
	}

	.project-media {
		position: relative;
		grid-column: 2;
		grid-row: 3;
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border: 1px solid var(--color-border);
		background: var(--color-surface-soft);
		cursor: pointer;
	}

	.project-media:active {
		cursor: pointer;
	}

	.project-image,
	.project-video {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
		object-fit: cover;
	}

	.project-video {
		pointer-events: auto;
		transform: scale(1.01);
	}

	.play-badge {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 9999px;
		background: rgb(0 0 0 / 0.65);
		color: white;
		border: 1px solid rgb(255 255 255 / 0.2);
		transition: transform 0.2s ease, background-color 0.2s ease;
	}

	.project-media:hover .play-badge {
		transform: translate(-50%, -50%) scale(1.1);
		background: var(--color-accent);
	}

	.project-overlay {
		position: absolute;
		inset: auto 0 0;
		z-index: 2;
		padding: clamp(1rem, 3vw, 2rem);
		background: linear-gradient(to top, rgb(0 0 0 / 0.72), rgb(0 0 0 / 0));
		color: white;
	}

	.project-overlay p {
		max-width: 36rem;
		margin: 0.8rem 0 0;
		color: rgb(255 255 255 / 0.82);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	@media (min-width: 48rem) {
		.project-overlay p {
			font-size: 1rem;
		}
	}

	/* A row of the list: closed, it is a name and a year; open, it says what the thing is. */
	.more-row summary {
		cursor: pointer;
		list-style: none;
	}

	.more-row summary::-webkit-details-marker {
		display: none;
	}

	.more-row[open] .more-name {
		text-decoration-color: var(--color-accent);
	}

	.more-body {
		display: grid;
		justify-items: start;
		gap: 0.5rem;
		padding: 0.25rem 0 0.5rem;
	}

	.more-body p {
		margin: 0;
		max-width: 34rem;
	}

	/* Where the margin is too narrow for the year to hang, it sits at the end of the row. */
	@media (max-width: 59.99rem) {
		.more-row summary {
			display: flex;
			flex-direction: row-reverse;
			align-items: baseline;
			justify-content: space-between;
			gap: 1rem;
		}
	}

	.project-copy {
		grid-column: 2;
		grid-row: 4;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 2rem;
		padding: 0.9rem 0.25rem 0;
	}

	.project-copy span {
		flex: none;
		color: var(--color-text-muted);
		letter-spacing: 0;
	}

	@media (max-width: 700px) {
		/* Stacked, in the same gutters as the rest of the site. */
		.horizontal-scene {
			padding: 1rem 1.5rem;
		}

		.intro-slide.opening,
		.intro-slide.closing {
			width: 100%;
			min-width: 0;
			padding: 1.5rem 0;
		}

		.work-progress {
			display: none;
		}

		.horizontal-pin {
			height: auto;
			overflow: visible;
		}

		.horizontal-track {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
			width: 100%;
			height: auto;
			transform: none !important;
			will-change: auto;
		}

		.work-slide {
			width: 100%;
			height: auto;
		}

		.project-slide {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto auto;
			padding: 0;
		}

		.project-meta,
		.project-media {
			grid-column: 1;
		}

		.project-meta {
			grid-row: 1;
			margin-bottom: 0.5rem;
			padding-inline: 0;
		}

		.project-media {
			grid-row: 2;
		}

		.project-copy {
			display: block;
		}

		.project-copy span {
			display: block;
			margin-top: 0.5rem;
		}

		.project-overlay {
			padding: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.horizontal-pin,
		.horizontal-track {
			will-change: auto;
		}
	}
</style>
