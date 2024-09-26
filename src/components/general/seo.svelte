<script>
	import { page } from '$app/stores';

	export let title = '';
	export let description = '';
	export let image = '';
	export let canonical = '';
	export let published = true;
	export let type = 'website';
	export let twitterHandle = '@abdulmuminyqn';
	export let siteName = 'Abdulmumin Yaqeen';

	$: truncatedDescription = description.slice(0, 300);
	$: ogImage = image || `${$page.url.origin}/og?message=${encodeURIComponent(title)}`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={truncatedDescription} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={$page.url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={truncatedDescription} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:site_name" content={siteName} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={twitterHandle} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={truncatedDescription} />
	<meta name="twitter:image" content={ogImage} />

	<!-- Other important meta tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta http-equiv="content-language" content="en-us" />

	{#if published}
		<meta name="robots" content="index, follow" />
	{:else}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}
</svelte:head>
