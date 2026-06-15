<script>
	import { onMount } from 'svelte';
	import { formatDate, copyUrlToClipboard } from '$lib/js/utils.js';
	import {
		faHackerNews,
		faLinkedin,
		faReddit,
		faTwitter
	} from '@fortawesome/free-brands-svg-icons';
	import { faCopy } from '@fortawesome/free-solid-svg-icons';
	import Ad from '../../../components/mainBlog/ad.svelte';
	import Seo from '../../../components/general/seo.svelte';
	import Fa from 'svelte-fa';
	import {
		authorName,
		authorUrl,
		defaultSocialImage,
		logoUrl,
		siteName,
		siteOrigin,
		socialProfiles
	} from '$lib/js/config.js';

	let { data } = $props();

	const toSchemaDate = (value) => {
		if (!value) return '';
		const date = new Date(value.includes('T') ? value : `${value}T00:00:00Z`);
		return Number.isNaN(date.getTime()) ? '' : date.toISOString();
	};

	let pageUrl = $derived(`${siteOrigin}/blog/${data.slug}`);
	let canonicalUrl = $derived(data.meta?.canonical || `${siteOrigin}/blog/${data.slug}`);
	let shareUrl = $derived(canonicalUrl);
	let description = $derived(data.meta?.description || `Read ${data.meta?.title} on ${siteName}.`);
	let imageUrl = $derived(data.meta?.image || defaultSocialImage);
	let encodedTitle = $derived(encodeURIComponent(data.meta.title));
	let publishedTime = $derived(toSchemaDate(data.meta.date));
	let modifiedTime = $derived(toSchemaDate(data.meta.lastmod || data.meta.date));
	let articleRobots = $derived(
		canonicalUrl.startsWith(siteOrigin) ? 'index, follow' : 'noindex, follow'
	);
	let articleSchema = $derived(
		canonicalUrl.startsWith(siteOrigin)
			? JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'BlogPosting',
					headline: data.meta.title,
					description,
					image: [imageUrl],
					datePublished: publishedTime || data.meta.date,
					dateModified: modifiedTime || data.meta.lastmod || data.meta.date,
					mainEntityOfPage: canonicalUrl,
					url: canonicalUrl,
					inLanguage: 'en',
					isAccessibleForFree: true,
					articleSection: data.meta.categories || [],
					keywords: (data.meta.categories || []).join(', '),
					author: {
						'@type': 'Person',
						name: authorName,
						url: authorUrl,
						sameAs: socialProfiles
					},
					publisher: {
						'@type': 'Organization',
						name: siteName,
						url: siteOrigin,
						logo: {
							'@type': 'ImageObject',
							url: logoUrl
						}
					}
				})
			: ''
	);
	let breadcrumbSchema = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: siteOrigin
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Blog',
					item: `${siteOrigin}/blog`
				},
				{
					'@type': 'ListItem',
					position: 3,
					name: data.meta.title,
					item: pageUrl
				}
			]
		})
	);

	function scrollToTopSmooth() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	onMount(() => {
		scrollToTopSmooth();
	});
</script>

<svelte:head>
	<Seo
		title={data.meta?.title}
		{description}
		published={data.meta?.published}
		canonical={canonicalUrl}
		type="article"
		image={imageUrl}
		robots={articleRobots}
		{publishedTime}
		{modifiedTime}
		section={data.meta.categories?.[0] || ''}
		tags={data.meta.categories || []}
	/>
	<svelte:element this={'script'} type="application/ld+json">{breadcrumbSchema}</svelte:element>
	{#if articleSchema}
		<svelte:element this={'script'} type="application/ld+json">{articleSchema}</svelte:element>
	{/if}

	<script async defer src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</svelte:head>

<article class="max-w-2xl mx-auto px-2 md:px-6 flex flex-col gap-4">
	<hgroup class="flex flex-col gap-4 py-12">
		<h1 class="text-4xl md:text-5xl font-serif text-text-main leading-tight italic">
			{data.meta.title}
		</h1>
		<div
			class="flex gap-4 text-sm font-serif text-text-muted italic border-b border-border/20 pb-6"
		>
			<span class="text-accent not-italic font-mono text-[10px] tracking-widest uppercase"
				>/ {formatDate(data.meta.date)}</span
			>
			{#if data.meta.date != data.meta.lastmod}
				<span>edited {formatDate(data.meta.lastmod)}</span>
			{/if}
		</div>
	</hgroup>

	<section class="flex w-full flex-col gap-8">
		<div class="flex-1">
			<data.content />
		</div>
	</section>

	<div class="pt-12 border-t border-border/20 mt-12 mb-20">
		<p class="text-[9px] font-mono uppercase tracking-[0.3em] text-text-muted mb-3">/share</p>
		<div class="flex gap-3 text-xs text-text-muted">
			<button
				onclick={() => copyUrlToClipboard(shareUrl)}
				class="hover:text-text-main transition-colors"
				aria-label="Copy article URL"
			>
				<Fa icon={faCopy} />
			</button>
			<a
				href={`https://x.com/intent/post?url=${encodeURIComponent(shareUrl)}&text=${encodedTitle}`}
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-text-main transition-colors"
				aria-label="Share on Twitter"
			>
				<Fa icon={faTwitter} />
			</a>
			<a
				href={`https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodedTitle}`}
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-text-main transition-colors"
				aria-label="Share on Reddit"
			>
				<Fa icon={faReddit} />
			</a>
			<a
				href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-text-main transition-colors"
				aria-label="Share on LinkedIn"
			>
				<Fa icon={faLinkedin} />
			</a>
			<a
				href={`https://news.ycombinator.com/submitlink?u=${encodeURIComponent(shareUrl)}&t=${encodedTitle}`}
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-text-main transition-colors"
				aria-label="Share on Hacker News"
			>
				<Fa icon={faHackerNews} />
			</a>
		</div>
	</div>
	<div class="mt-16">
		<Ad />
	</div>
</article>
