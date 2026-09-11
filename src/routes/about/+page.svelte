<script>
	import Seo from '$components/general/seo.svelte';
	import {
		authorName,
		authorUrl,
		defaultSocialImage,
		siteOrigin,
		socialProfiles
	} from '$lib/js/config.js';
	import me from '$lib/images/me.jpeg';
	import { darkMode } from '$lib/utils/darkmode.js';

	const aboutSchema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: authorName,
		url: authorUrl,
		image: `${siteOrigin}${me}`,
		description:
			'Product engineer, open-source contributor, and writer exploring AI agent infrastructure, dev tools, and interface design.',
		sameAs: socialProfiles
	});
</script>

<svelte:head>
	<Seo
		title="About | Abdulmumin Yaqeen"
		description="Abdulmumin Yaqeen is a product engineer, open-source contributor, and writer exploring AI agent infrastructure, dev tools, and interface design."
		canonical={`${siteOrigin}/about`}
		image={defaultSocialImage}
	/>
	<svelte:element this={'script'} type="application/ld+json">{aboutSchema}</svelte:element>
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-10">
	<!-- Heading & Intro -->
	<div class="max-w-xl mx-auto w-full flex flex-col gap-2">
		<h1 class="text-2xl md:text-3xl font-semibold tracking-tight text-text-main font-sans">
			Abdulmumin Yaqeen
		</h1>
		<p class="text-text-muted text-base md:text-lg">
			Hi, I'm Abdulmumin Abdulkarim — most people call me <span class="text-text-main font-medium">Yaqeen</span> <span class="text-xs tracking-wide text-text-muted/70 font-mono">(/jæ'ki:n/)</span>.
		</p>
	</div>

	<!-- Image -->
	<div class="w-full max-w-xl mx-auto overflow-hidden rounded-xl border border-border/20 shadow-sm bg-neutral-900/5">
		{#if $darkMode}
			<img src="/me-dark.jpg" alt="Abdulmumin Yaqeen" class="w-full object-cover aspect-[16/10]" />
		{:else}
			<img src="/yaqeen.jpeg" alt="Abdulmumin Yaqeen" class="w-full object-cover aspect-[16/10]" />
		{/if}
	</div>

	<!-- Bio Content -->
	<div class="max-w-xl mx-auto w-full flex flex-col gap-6 text-[16px] md:text-[17px] text-text-muted leading-relaxed">
		<p>
			I am a product engineer focused on infrastructure for autonomous agents, developer tooling, and modern web interfaces. Most of my days are spent <a class="text-text-main underline decoration-accent/40 underline-offset-4 hover:decoration-accent transition-all font-medium" href="/projects">building experiments</a>, exploring new technical primitives, and contributing to open-source software.
		</p>

		<p>
			Over the years, I've built multiplayer coding runtimes, billing systems, and lightweight developer utilities, with contributions to projects like Svelte, Pydantic, and shadcn-svelte.
		</p>

		<div class="pt-2 border-t border-border/10 flex flex-col gap-4">
			<h2 class="text-sm font-semibold uppercase tracking-wider text-text-main/80 font-mono">
				Beyond Code
			</h2>
			<p>
				Outside of engineering, I enjoy dabbling in creative side-tracks: experimenting with 3D models in Blender, capturing <a class="text-text-main underline decoration-accent/40 underline-offset-4 hover:decoration-accent transition-all font-medium" href="/photos">everyday moments on camera</a>, and reading poetry.
			</p>
			<p>
				Previously, I also hosted a tech <a
					class="text-text-main underline decoration-accent/40 underline-offset-4 hover:decoration-accent transition-all font-medium"
					href="https://www.youtube.com/@abdulmuminyqn"
					target="_blank"
					rel="noopener noreferrer">YouTube channel</a
				>, sharing what I learned as I built in the open.
			</p>
		</div>
	</div>
</div>
