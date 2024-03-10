<script>
	import { onMount } from 'svelte';
	export let data;
	import { formatDate, insertCopyButton, copyUrlToClipboard } from '$lib/js/utils.js';
	import { mylinks } from '$lib/utils/randomstore.js';
	import me from '$lib/images/abdul.jpg';
	// import { faGithub, faLinkedinIn, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';

	import Fa from 'svelte-fa';
	import {
		faFacebook,
		faHackerNews,
		faLinkedin,
		faReddit,
		faTwitter,
		faWhatsapp,
		faGithub,
		faYoutube
	} from '@fortawesome/free-brands-svg-icons';
	import { faCopy, faRightLong } from '@fortawesome/free-solid-svg-icons';
	import { scale, slide } from 'svelte/transition';
	import Ad from '../../../components/mainBlog/ad.svelte';
	import { page } from '$app/stores';
	let url;
	function scrollToTopSmooth() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	onMount(() => {
		scrollToTopSmooth();
		url = window.location.href;
		insertCopyButton(faCopy);
		url = url.replace('www.', '');
	});

	function convertLinkToRequestReadable(link) {
		// Encode the link using encodeURIComponent
		var encodedLink = encodeURIComponent(link);

		return encodedLink;
	}

	let encodedTitle = convertLinkToRequestReadable(data.meta.title);
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta?.description} />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://www.yaqeen.me/blog" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta?.description} />
	<meta
		property="og:image"
		content={data.meta?.thumbnail ??
			`${$page.url.origin}/og?message=${encodeURIComponent(data.meta.title)}`}
	/>

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="yaqeen.me" />
	<meta property="twitter:url" content="https://www.yaqeen.me" />
	<meta name="twitter:title" content={data.meta.title} />
	<meta name="twitter:description" content={data.meta?.description || data.meta.title} />
	<meta
		name="twitter:image"
		content={data.meta?.thumbnail ??
			`https://yaqeen.me/og?message=${encodeURIComponent(data.meta.title)}`}
	/>

	{#if data.meta?.published}
		<meta name="robots" content="index, follow" />
	{/if}

	<link rel="canonical" href={url} />
</svelte:head>

<article in:scale class="mx-auto flex flex-col gap-2 article">
	<hgroup
		class="md:h-[400px] justify-center mb-4 flex items-center rounded-lg w-full flex-col gap-3"
	>
		<div class="flex max-w-md md:max-w-[800px] flex-col md:items-center gap-2 justify-center">
			<h1 class="text-5xl md:text-6xl md:text-center">{data.meta.title}</h1>
			<p>Published {formatDate(data.meta.date)}</p>
			<div class="flex md:items-center">
				<div class="flex gap-2">
					<a href={$mylinks.github}>
						<Fa icon={faGithub} />
					</a>
					<a href={$mylinks.linkedin}>
						<Fa icon={faLinkedin} />
					</a>
					<a href={$mylinks.twitter}>
						<Fa icon={faTwitter} />
					</a>
					<a href={$mylinks.youtube}>
						<Fa icon={faYoutube} />
					</a>
				</div>
			</div>
		</div>
	</hgroup>
	<section class="flex w-full flex-col lg:flex-row">
		<div class="w-full">
			<div class="flex gap-3 flex-wrap mb-4">
				{#each data.meta.categories as tag}
					<span class="px-3 py-1 text-sm text-black rounded-lg bg-orang dark:bg-dark"
						><a href="/category/{tag}">&num;&nbsp;{tag}</a></span
					>
				{/each}
			</div>

			<div
				class="space-y-5 max-w-[800px] w-full markdown-content text-base
			"
			>
				<svelte:component this={data.content} />
			</div>
		</div>
		<aside class="relative w-[400px] hidden md:hidden lg:flex">
			<Ad />
		</aside>
	</section>
	<div class="w-full flex items-center justify-center p-3">
		<div
			class="w-full flex justify-between max-w-md items-center border border-b-2 rounded-2xl bg-orange-300 dark:bg-black border-orang dark:border-dark p-4"
		>
			<span>Love it? Share it!</span>
			<div class="flex space-x-3 items-center justify-center">
				<button
					on:click={() => {
						copyUrlToClipboard(url);
					}}><Fa icon={faCopy} /></button
				>
				<a
					href="https://twitter.com/share?url={convertLinkToRequestReadable(
						url
					)}%3Fref%3Dtwitter-share&amp;text={encodedTitle}"
					target="_blank"
					rel="noopener"
				>
					<span><Fa icon={faTwitter} /></span>
				</a>
				<a
					href="http://www.reddit.com/submit?url={url}&amp;title={encodedTitle}"
					target="_blank"
					rel="noopener"
				>
					<span><Fa icon={faReddit} /></span>
				</a>
				<a href="https://www.linkedin.com/cws/share?url={url}" target="_blank" rel="noopener">
					<span><Fa icon={faLinkedin} /></span>
				</a>
				<a
					href="http://news.ycombinator.com/submitlink?u={url}&amp;t={encodedTitle}"
					target="_blank"
					rel="noopener"
				>
					<Fa icon={faHackerNews} />
				</a>
				<a href="https://www.facebook.com/sharer/sharer.php?u={url}" target="_blank" rel="noopener">
					<Fa icon={faFacebook} />
				</a>
				<a
					href="https://api.whatsapp.com/send?text={encodedTitle}%20{url}"
					target="_blank"
					rel="noopener"
				>
					<Fa icon={faWhatsapp} />
				</a>
			</div>
		</div>
	</div>
</article>
