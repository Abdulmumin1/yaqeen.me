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
	const aboutSchema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: authorName,
		url: authorUrl,
		image: `${siteOrigin}${me}`,
		description:
			'Fullstack developer, cybersecurity graduate, and writer passionate about interfaces, dev tools, and building clean experiments.',
		sameAs: socialProfiles
	});
</script>

<svelte:head>
	<Seo
		title="About | Abdulmumin Yaqeen"
		description="Abdulmumin Yaqeen is a fullstack developer, cybersecurity graduate, and writer passionate about interfaces, dev tools, and building clean experiments."
		canonical={`${siteOrigin}/about`}
		image={defaultSocialImage}
	/>
	<svelte:element this={'script'} type="application/ld+json">{aboutSchema}</svelte:element>
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-16 md:py-28 flex flex-col gap-12">
	<div class="max-w-xl mx-auto w-full flex flex-col gap-2">
		<p class="text-text-muted text-base md:text-lg">Hi, I'm Abdulmumin Abdulkarim.</p>

		<p class="text-text-muted text-base md:text-lg">but, call me Yaqeen (/jæ'ki:n/).</p>
	</div>

	<div class="w-full overflow-hidden border border-border/10">
		<img src="/yaqeen.jpeg" alt="Abdulmumin Yaqeen" class="w-full object-cover" />
	</div>

	<div
		class="max-w-xl mx-auto w-full flex flex-col gap-6 text-[16px] md:text-[17px] text-text-muted leading-relaxed font-normal"
	>
		<p>I am a developer.</p>
		<p>
			I spend most of my time <a href="/projects">experimenting</a>, seeking knowledge, or doing
			open source.
		</p>
		<p>
			Previously, I ran a <a
				class="text-text-main decoration-accent/30 underline underline-offset-4 hover:decoration-accent transition-all font-medium"
				href="https://www.youtube.com/@abdulmuminyqn">YouTube channel</a
			> (I was as clueless as my audience). I remain strongly loyal to the Apache 2.0.
		</p>
	</div>
</div>
