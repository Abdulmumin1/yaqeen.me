<script>
	import BlogSection from '../components/blogHome/blogSection.svelte';
	import Seo from '../components/general/seo.svelte';
	import Hero from '../components/home/hero.svelte';
	import ProSection from '../components/projects/proSection.svelte';
	import {
		siteName,
		siteOrigin,
		description,
		defaultSocialImage,
		authorName,
		authorUrl,
		socialProfiles
	} from '$lib/js/config.js';

	const homeSchema = JSON.stringify([
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: siteName,
			url: siteOrigin,
			description
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
		description="Fullstack developer, cybersecurity graduate, and writer. Exploring interfaces, dev tools, and experiments at the edge of software."
		canonical={siteOrigin}
		image={defaultSocialImage}
	/>
	<svelte:element this={'script'} type="application/ld+json">{homeSchema}</svelte:element>
</svelte:head>

<div class="py-12 md:py-24 max-w-2xl mx-auto px-6">
	<Hero />

	<div class="mt-16 space-y-20">
		<ProSection />
		<BlogSection />
	</div>
</div>
