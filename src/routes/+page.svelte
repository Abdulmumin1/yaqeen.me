<script>
	import BlogSection from '../components/blogHome/blogSection.svelte';
	import Seo from '../components/general/seo.svelte';
	import Hero from '../components/home/hero.svelte';
	import ProSection from '../components/projects/proSection.svelte';
	import { fly, scale, slide, draw } from 'svelte/transition';
	import {
		authorName,
		authorUrl,
		defaultSocialImage,
		description as siteDescription,
		siteName,
		siteOrigin,
		socialProfiles
	} from '$lib/js/config.js';

	const homeSchema = JSON.stringify([
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: siteName,
			url: siteOrigin,
			description: siteDescription
		},
		{
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: authorName,
			url: authorUrl,
			sameAs: socialProfiles
		}
	]);
</script>

<svelte:head>
	<Seo
		title="Abdulmumin Yaqeen"
		description="A creative, curiosity-driven developer, writer, and builder of internet things."
		canonical={siteOrigin}
		image={defaultSocialImage}
	/>
	<svelte:element this={'script'} type="application/ld+json">{homeSchema}</svelte:element>
</svelte:head>

<div class="md:p-8 flex flex-col items-center min-h-screen">
	<div class="flex flex-col w-full max-w-2xl">
		<Hero />
		<div class="mt-4 px-6">
			<ProSection />
			<BlogSection />
		</div>
	</div>
</div>
