<script>
	import Seo from '../../components/general/seo.svelte';
	import { faFolder } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { project_data, sass_projects } from '$lib/utils/projectStore.js';

	const favoriteNames = ['Chump', 'ai-query.dev', 'Owostack', 'Thirdpen'];
	const projects = $derived([...$sass_projects, ...$project_data]);
	const favorites = $derived(
		favoriteNames.map((name) => projects.find((project) => project.name === name)).filter(Boolean)
	);
	const otherProjects = $derived(
		projects.filter((project) => !favoriteNames.includes(project.name))
	);
	const projectNotes = {
		Chump:
			'A coding agent I built to dogfood ai-query in a real product. Building it gives me a feedback loop for improving how stateful, collaborative agents work.',
		'ai-query.dev':
			'A Python framework for building stateful agents. I care about the developer experience here: agents that can persist, communicate, and be composed without hiding the important parts.',
		Owostack:
			'An experiment in making billing less painful. Plans are easy; usage, retries, proration, and all the small money decisions are where products usually get messy.',
		Thirdpen:
			'An interactive learning project for curious people. I use it to explore how writing, visual explanations, and software can make difficult ideas feel approachable.'
	};

	function linkFor(project) {
		const link = project.links.page || project.links.study;
		return link?.startsWith('http') ? link : `https://${link}`;
	}

	function logoFor(project) {
		if (project.name === 'Chump') return 'https://chmp.dev/favicon.svg';
		return project.icon;
	}

	let scrollY = $state(0);
	let innerHeight = $state(0);
	let trackNode = $state(null);

	let trainProgress = $derived.by(() => {
		// Read scrollY so this calculation reruns for every scroll event.
		scrollY;
		if (!trackNode || !innerHeight) return 0;
		const rect = trackNode.getBoundingClientRect();
		const progress = (innerHeight / 2 - rect.top) / rect.height;
		return Math.max(0, Math.min(1, progress));
	});
</script>

<svelte:head>
	<Seo title="Work" description="A few products and experiments built by Abdulmumin Yaqeen." />
</svelte:head>
<svelte:window bind:scrollY bind:innerHeight />

<article class="mx-auto max-w-2xl px-6 py-16 md:py-24">
	<header class="mb-5">
		<h1 class="mb-7 text-2xl font-normal leading-tight tracking-tight text-text-main md:text-3xl">
			A few things I’ve built
		</h1>
		<div class="space-y-5 text-lg leading-relaxed text-text-muted">
			<p>
				I build to understand the problem, then keep going until the thing is useful to someone
				besides me.
			</p>
		</div>
	</header>

	<section class="mb-10 text-base leading-relaxed text-text-muted">
		<p>
			Alongside these experiments, I’ve spent 3+ years doing product engineering at
			<a
				class="text-accent underline underline-offset-4"
				href="https://cloudplexo.com"
				target="_blank"
				rel="noopener noreferrer">CloudPlexo</a
			>, leading a team of 2 to build
			<a
				class="text-accent underline underline-offset-4"
				href="https://agentspec.ai"
				target="_blank"
				rel="noopener noreferrer">AgentSpec.ai</a
			>,
			<a
				class="text-accent underline underline-offset-4"
				href="https://wendu.io"
				target="_blank"
				rel="noopener noreferrer">Wendu.io</a
			>, and
			<a
				class="text-accent underline underline-offset-4"
				href="https://checkitme.com"
				target="_blank"
				rel="noopener noreferrer">Checkitme.com</a
			>.
		</p>
	</section>

	<div class="relative space-y-16 text-[1.05rem] leading-relaxed text-text-main md:pl-24">
		<div
			bind:this={trackNode}
			class="pointer-events-none absolute bottom-8 left-0 top-8 hidden w-24 justify-center md:flex"
		>
			<div class="train-track relative h-full w-5">
				<div
					class="train absolute left-1/2 z-10 text-accent"
					style:top={`${trainProgress * 100}%`}
					style="transform: translate(-50%, -24px)"
				>
					<svg
						width="24"
						height="48"
						viewBox="0 0 24 48"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect x="2" y="2" width="20" height="44" rx="4" fill="currentColor" />
						<rect x="6" y="8" width="12" height="10" rx="2" fill="var(--color-surface)" />
						<rect x="6" y="22" width="12" height="10" rx="2" fill="var(--color-surface)" />
						<rect x="6" y="36" width="12" height="10" rx="2" fill="var(--color-surface)" />
					</svg>
				</div>
			</div>
		</div>
		{#each favorites as project, index (project.name)}
			<section class="relative space-y-5" aria-labelledby={`project-${index}`}>
				<div class="absolute -left-24 top-0 hidden w-24 justify-center md:flex z-10">
					<div
						class="flex h-12 w-12 items-center justify-center bg-orange-100/90 border border-border/30  rounded-xl"
					>
						{#if logoFor(project)}
							<img src={logoFor(project)} alt="" class="h-8 rounded-lg w-8 object-contain" />
						{:else}
							<Fa icon={faFolder} class="text-xl text-text-muted" />
						{/if}
					</div>
				</div>
				<div class="flex items-baseline justify-between gap-4 pt-2">
					<h2 id={`project-${index}`} class="text-2xl font-normal">{project.name}</h2>
					<span class="font-mono text-xs text-text-muted">{project.year}</span>
				</div>

				<div class="overflow-hidden rounded-lg border border-border bg-surface-soft/30">
					{#if project.name === 'Owostack'}
						<div class="aspect-video">
							<iframe
								src="https://www.youtube.com/embed/vVq5Qrd2Qmc"
								title="Owostack product walkthrough"
								class="h-full w-full"
								loading="lazy"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowfullscreen
							></iframe>
						</div>
					{:else if project.name === 'Thirdpen'}
						<div class="aspect-video">
							<iframe
								src="https://www.youtube.com/embed/C6RJ8lcIKs4"
								title="Thirdpen product walkthrough"
								class="h-full w-full"
								loading="lazy"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowfullscreen
							></iframe>
						</div>
					{:else if project.imagelist?.[0]}
						<img
							src={project.imagelist[0]}
							alt={`${project.name} preview`}
							class="aspect-[16/9] w-full object-cover"
							loading="lazy"
						/>
					{/if}
				</div>
				<p>{projectNotes[project.name] || project.description}.</p>
				<a
					href={linkFor(project)}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-block text-sm text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
				>
					visit {project.name} →
				</a>
			</section>
		{/each}
	</div>

	<style>
		.train-track {
			opacity: 0.4;
			border-left: 2px solid var(--color-border);
			border-right: 2px solid var(--color-border);
			background: repeating-linear-gradient(
				to bottom,
				transparent,
				transparent 16px,
				var(--color-border) 16px,
				var(--color-border) 20px
			);
		}

		.train {
			transition: top 160ms linear;
			filter: drop-shadow(0 0 8px color-mix(in srgb, var(--color-accent) 40%, transparent));
		}
	</style>

	<section class="mt-20" aria-labelledby="all-projects-heading">
		<h2 id="all-projects-heading" class="mb-5 text-2xl font-normal">More projects</h2>
		<div class="divide-y divide-border border-y border-border">
			{#each otherProjects as project (project.name)}
				<details class="group py-4">
					<summary
						class="flex cursor-pointer list-none items-baseline justify-between gap-4 text-base marker:hidden"
					>
						<span class="flex items-center gap-3 group-open:text-accent">
							{#if logoFor(project)}
								<img src={logoFor(project)} alt="" class="h-6 w-6 rounded object-contain" />
							{/if}
							{project.name}
						</span>
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

	<footer class="mt-20 border-t border-border pt-6 text-base leading-relaxed text-text-muted">
		<p>
			There are plenty of smaller experiments scattered around too. The source for most of these is
			<a
				class="text-accent underline underline-offset-4"
				href="https://github.com/Abdulmumin1"
				target="_blank"
				rel="noopener noreferrer">on GitHub</a
			>.
		</p>
	</footer>
</article>
