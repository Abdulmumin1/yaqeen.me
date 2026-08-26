<script>
	import { onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Seo from '../../components/general/seo.svelte';
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
	}

	function thumbnailFor(videoId) {
		return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
	}

	let containerNode = $state(null);
	let rowNode = $state(null);
	let activeSlide = $state(0);
	let playingProject = $state(null);
	let cleanupWorkScroll = () => {};
	const slideCount = $derived(favorites.length + 2);

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
		}, containerNode);

		cleanupWorkScroll = cleanup;
		return cleanup;
	});
</script>

<svelte:head>
	<Seo title="Work" description="A few products and experiments built by Abdulmumin Yaqeen." />
</svelte:head>

<div bind:this={containerNode} class="horizontal-scene">
	<div class="work-progress" aria-hidden="true">
		{#each Array.from({ length: slideCount }, (_, index) => index) as index (index)}
			<span class:active={index === activeSlide}></span>
		{/each}
	</div>


	<div class="horizontal-pin">
		<div bind:this={rowNode} class="horizontal-track">
			<article class="work-slide intro-slide" data-slide-index={0}>
				<div class="intro-card">
					<p class="intro-text">
						8+ years in tech and I’ve spent about 4 years doing product engineering at
						<a href="https://cloudplexo.com" target="_blank" rel="noopener noreferrer">CloudPlexo</a>,
						leading a team of 2 to build
						<a href="https://agentspec.ai" target="_blank" rel="noopener noreferrer">AgentSpec.ai</a>,
						<a href="https://wendu.io" target="_blank" rel="noopener noreferrer">Wendu.io</a>, and
						<a href="https://checkitme.com" target="_blank" rel="noopener noreferrer">Checkitme.com</a>.
						Some personal projects/saas I really love ->
					</p>
				</div>
			</article>
			{#each favorites as project, index (project.name)}
				{@const videoId = videoFor(project)}
				<article class="work-slide project-slide slide-{index + 1}" data-slide-index={index + 1}>
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
			<article class="work-slide intro-slide" data-slide-index={favorites.length + 1}>
				<div class="intro-card">
					<p class="intro-text">
						I'm a bit of open source guy and i do it from time to time. I’ve made
						contributions to notable projects like
						<a href="https://github.com/sveltejs/svelte" target="_blank" rel="noopener noreferrer">Svelte</a>,
						<a href="https://github.com/pydantic/pydantic" target="_blank" rel="noopener noreferrer">Pydantic</a>,
						<a href="https://github.com/huntabyte/shadcn-svelte" target="_blank" rel="noopener noreferrer">shadcn-svelte</a>,
						<a href="https://github.com/hookdeck/outpost" target="_blank" rel="noopener noreferrer">Outpost</a>,
						and
						<a href="https://github.com/flet-dev/flet" target="_blank" rel="noopener noreferrer">Flet</a>,
						alongside maintaining my own open source experiments on
						<a href="https://github.com/Abdulmumin1" target="_blank" rel="noopener noreferrer">GitHub</a>.
					</p>
				</div>
			</article>
		</div>
	</div>
</div>

<div class="max-w-3xl mx-auto px-6 md:px-12 py-16">
	<section class="mt-20" aria-labelledby="all-projects-heading">
		<h2 id="all-projects-heading" class="mb-5 text-2xl font-normal">More projects</h2>
		<div class="divide-y divide-border border-y border-border">
			{#each otherProjects as project (project.name)}
				<details class="group py-4">
					<summary
						class="flex cursor-pointer list-none items-baseline justify-between gap-4 text-base marker:hidden"
					>
						<span class="group-open:text-accent">{project.name}</span>
						<span class="font-mono text-xs text-text-muted">{project.year}</span>
					</summary>
					<div class="space-y-3 pb-2 pt-4 text-sm leading-relaxed text-text-muted">
						<p>{project.description}</p>
						<a
							class="text-accent underline underline-offset-4"
							href={linkFor(project)}
							target="_blank"
							rel="noopener noreferrer"
						>
							open project →
						</a>
					</div>
				</details>
			{/each}
		</div>
	</section>

	<footer class="pt-8 text-sm text-text-muted flex justify-between">
		<a
			class="hover:text-text-main transition-colors"
			href="https://github.com/Abdulmumin1"
			target="_blank"
			rel="noopener noreferrer">more on github ↗</a
		>
	</footer>
</div>

<style>
	.horizontal-scene {
		position: relative;
		background: var(--color-surface);
	}

	.work-progress,
	.project-meta {
		font-family: 'Commit Mono', ui-monospace, monospace;
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.intro-slide {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-inline: clamp(1.5rem, 6vw, 6rem);
	}

	.intro-card {
		/*background: color-mix(in srgb, var(--color-accent) 22%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-accent) 35%, transparent);
		border-radius: 4px;*/
		padding: clamp(1.5rem, 3vw, 2.5rem);
		max-width: 38rem;
	}

	.intro-text {
		font-size: clamp(1.05rem, 1.5vw, 1.35rem);
		line-height: 1.65;
		color: var(--color-text-main);
	}

	.intro-text a {
		color: var(--color-accent);
		text-decoration: none;
	}

	.horizontal-pin {
		position: relative;
		height: 100vh;
		width: 100%;
		overflow: hidden;
		will-change: transform;
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
	}

	.work-progress span {
		width: 1px;
		height: 1.1rem;
		background: var(--color-text-muted);
		opacity: 0.55;
		transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, opacity 0.2s ease;
	}

	.work-progress span.active {
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
		color: rgb(255 255 255 / 0.78);
		font-size: clamp(0.9rem, 1.2vw, 1.05rem);
		line-height: 1.45;
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
		.horizontal-scene {
			padding: 1rem;
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
