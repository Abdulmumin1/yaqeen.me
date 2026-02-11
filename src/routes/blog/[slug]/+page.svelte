<script>
	import { onMount } from 'svelte';
	import { formatDate, copyUrlToClipboard } from '$lib/js/utils.js';
	import {
		faFacebook,
		faHackerNews,
		faLinkedin,
		faReddit,
		faTwitter,
		faWhatsapp
	} from '@fortawesome/free-brands-svg-icons';
	import { faCopy } from '@fortawesome/free-solid-svg-icons';
	import Ad from '../../../components/mainBlog/ad.svelte';
	import Seo from '../../../components/general/seo.svelte';
	import Fa from 'svelte-fa';

	let { data } = $props();

	let entities = $derived({
		title: data.meta.title,
		email: 'abdulmuminyqn@gmail.com',
		rich: true,
		domain: 'https://yaqeen.me'
	});

	let url;
	function scrollToTopSmooth() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	onMount(() => {
		scrollToTopSmooth();
	});

	function convertLinkToRequestReadable(link) {
		var encodedLink = encodeURIComponent(link);
		return encodedLink;
	}

	let encodedTitle = $derived(convertLinkToRequestReadable(data.meta.title));
</script>

<svelte:head>
	<Seo
		title={data.meta?.title}
		description={data.meta?.description}
		published={data.meta?.published}
		canonical={data.meta?.canonical}
	/>
</svelte:head>

<article class="max-w-2xl mx-auto px-2 md:px-6  flex flex-col gap-4">
	<hgroup class="flex flex-col gap-2 pb-4 border-b border-primary/10">
		<h1 class="text-xl font-bold text-primary">
			{data.meta.title}
		</h1>
		<div class="flex gap-3 text-[10px] font-mono opacity-50">
			<span>{formatDate(data.meta.date)}</span>
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

	<!-- Redesigned Ad Section as Footer Built-by-Me -->
	<div class="mt-12 border-t border-primary/10 pt-8">
		<Ad />
	</div>

	<div class="pt-8 border-t border-primary/10 mt-8 mb-12">
		<p class="text-[9px] font-mono uppercase tracking-[0.3em] opacity-30 mb-3">/share</p>
		<div class="flex gap-3 text-xs opacity-60">
			<button onclick={() => copyUrlToClipboard(url)} class="hover:opacity-100 transition-opacity">
				<Fa icon={faCopy} />
			</button>
			<a
				href="https://twitter.com/share?url={convertLinkToRequestReadable(
					url
				)}%3Fref%3Dtwitter-share&amp;text={encodedTitle}"
				target="_blank"
				rel="noopener"
				class="hover:opacity-100 transition-opacity"
			>
				<Fa icon={faTwitter} />
			</a>
			<a
				href="http://www.reddit.com/submit?url={url}&amp;title={encodedTitle}"
				target="_blank"
				rel="noopener"
				class="hover:opacity-100 transition-opacity"
			>
				<Fa icon={faReddit} />
			</a>
			<a
				href="https://www.linkedin.com/cws/share?url={url}"
				target="_blank"
				rel="noopener"
				class="hover:opacity-100 transition-opacity"
			>
				<Fa icon={faLinkedin} />
			</a>
			<a
				href="http://news.ycombinator.com/submitlink?u={url}&amp;t={encodedTitle}"
				target="_blank"
				rel="noopener"
				class="hover:opacity-100 transition-opacity"
			>
				<Fa icon={faHackerNews} />
			</a>
		</div>
	</div>
</article>
