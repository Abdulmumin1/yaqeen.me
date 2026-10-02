<script>
	import { resolve } from '$app/paths';
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

<div class="page flex flex-col gap-10">
	<!-- Heading & Intro -->
	<div class="flex flex-col gap-3">
		<h1 class="type-title text-text-main">Abdulmumin Yaqeen</h1>
		<p class="type-body text-text-muted">
			Hi, I'm Abdulmumin Abdulkarim — most people call me
			<span class="font-medium text-text-main">Yaqeen</span>
			<span class="type-tiny font-mono text-text-faint">(/jæ'ki:n/)</span>.
		</p>
	</div>

	<!-- Image (Flat) -->
	<div class="w-full overflow-hidden rounded-lg">
		{#if $darkMode}
			<img src="/me-dark.jpg" alt="Abdulmumin Yaqeen" class="aspect-[16/10] w-full object-cover" />
		{:else}
			<img src="/yaqeen.jpeg" alt="Abdulmumin Yaqeen" class="aspect-[16/10] w-full object-cover" />
		{/if}
	</div>

	<!-- Bio Content -->
	<div class="type-body flex flex-col gap-6 text-text-body">
		<p>
			I am a product engineer focused on infrastructure for autonomous agents, developer tooling,
			and modern web interfaces. Most of my days are spent
			<a class="link" href={resolve('/projects')}>building experiments</a>, exploring new technical
			primitives, and contributing to open-source software.
		</p>

		<p>
			Over the years, I've built multiplayer coding runtimes, billing systems, and lightweight
			developer utilities, with contributions to projects like Svelte, Pydantic, and shadcn-svelte.
		</p>

		<div class="flex flex-col gap-4 border-t border-border pt-6">
			<h2 class="type-tiny font-mono tracking-[0.08em] text-text-muted uppercase">Beyond Code</h2>
			<p>
				Outside of engineering, I enjoy dabbling in creative side-tracks: experimenting with 3D
				models in Blender, capturing
				<a class="link" href={resolve('/photos')}>everyday moments on camera</a>, and reading
				poetry.
			</p>
			<p>
				Previously, I also hosted a tech
				<a
					class="link"
					href="https://www.youtube.com/@abdulmuminyqn"
					target="_blank"
					rel="noopener noreferrer">YouTube channel</a
				>, sharing what I learned as I built in the open.
			</p>
		</div>
	</div>
</div>
