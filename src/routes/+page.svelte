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

	let { data } = $props();

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
		<BlogSection {data} />
		<div class="hidden">

		<h5>randoms about me</h5>
		<p class="font-pixel">
		I spend most of my time building agents, amazingly stunning ui and dev tools,
		My career has been all over the place. And I'm not sure how I would even identify myself now. I shapeshift between an engineer, product manager, and designer.
		I love to write, i write quite a bit -- yaqeen.me/blog, i really enjoy owning products end to end, i’ve built a bunch of them (yaqeen.me/work) and everything is open source (github.com/Abdulmumin1)

		Really you would get to know be better if you take your time to explore my products or read my blogs.

		</p>
	</div>
	</div>
</div>
