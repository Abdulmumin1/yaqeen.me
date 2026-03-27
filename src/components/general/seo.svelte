<script>
	import { page } from '$app/stores';
	import {
		authorName,
		defaultSocialImage,
		description as defaultDescription,
		siteName as defaultSiteName,
		siteOrigin
	} from '$lib/js/config.js';

	/**
	 * @typedef {Object} Props
	 * @property {string} [title]
	 * @property {string} [description]
	 * @property {string} [image]
	 * @property {string} [canonical]
	 * @property {boolean} [published]
	 * @property {string} [type]
	 * @property {string} [twitterHandle]
	 * @property {string} [siteName]
	 * @property {string} [robots]
	 * @property {string} [publishedTime]
	 * @property {string} [modifiedTime]
	 * @property {string} [section]
	 * @property {string[]} [tags]
	 */

	const toAbsoluteUrl = (value) => {
		try {
			return new URL(value, siteOrigin).toString();
		} catch {
			return siteOrigin;
		}
	};

	/** @type {Props} */
	let {
		title = '',
		description = '',
		image = '',
		canonical = '',
		published = true,
		type = 'website',
		twitterHandle = '@abdulmuminyqn',
		siteName = defaultSiteName,
		robots = '',
		publishedTime = '',
		modifiedTime = '',
		section = '',
		tags = []
	} = $props();

	let resolvedTitle = $derived(title || defaultSiteName);
	let truncatedDescription = $derived((description || defaultDescription).slice(0, 300));
	let resolvedCanonical = $derived(
		// Prerendered pages cannot safely read query state, so default canonicals use the path only.
		toAbsoluteUrl(canonical || $page.url.pathname)
	);
	let ogImage = $derived(toAbsoluteUrl(image || defaultSocialImage));
	let resolvedRobots = $derived(
		robots ||
			(published
				? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
				: 'noindex, nofollow')
	);
</script>

<title>{resolvedTitle}</title>
<meta name="description" content={truncatedDescription} />
<meta name="author" content={authorName} />
<meta name="referrer" content="strict-origin-when-cross-origin" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content={type} />
<meta property="og:url" content={resolvedCanonical} />
<meta property="og:title" content={resolvedTitle} />
<meta property="og:description" content={truncatedDescription} />
<meta property="og:image" content={ogImage} />
<meta property="og:image:alt" content={resolvedTitle} />
<meta property="og:site_name" content={siteName} />
<meta property="og:locale" content="en_US" />
{#if type === 'article' && publishedTime}
	<meta property="article:published_time" content={publishedTime} />
{/if}
{#if type === 'article' && modifiedTime}
	<meta property="article:modified_time" content={modifiedTime} />
{/if}
{#if type === 'article' && section}
	<meta property="article:section" content={section} />
{/if}
{#if type === 'article'}
	{#each tags as tag (tag)}
		<meta property="article:tag" content={tag} />
	{/each}
{/if}

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content={twitterHandle} />
<meta name="twitter:creator" content={twitterHandle} />
<meta property="twitter:domain" content="yaqeen.me" />
<meta property="twitter:url" content={resolvedCanonical} />
<meta name="twitter:title" content={resolvedTitle} />
<meta name="twitter:description" content={truncatedDescription} />
<meta name="twitter:image" content={ogImage} />
<meta name="twitter:image:alt" content={resolvedTitle} />

<!-- Other important meta tags -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="content-language" content="en-us" />
<meta name="robots" content={resolvedRobots} />
<meta name="googlebot" content={resolvedRobots} />

<link rel="canonical" href={resolvedCanonical} />
