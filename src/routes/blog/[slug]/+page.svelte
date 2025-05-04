<script>
	import { onMount } from 'svelte';
	import { formatDate, insertCopyButton, copyUrlToClipboard } from '$lib/js/utils.js';
	import { mylinks } from '$lib/utils/randomstore.js';
	import me from '$lib/images/abdul.jpg';
	// import { faGithub, faLinkedinIn, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';

	import Fa from 'svelte-fa';

	import { Comment } from '@commentrig/svelte';
	let entities = {
		title: data.meta.title,
		email: 'abdulmuminyqn@gmail.com',
		rich: true,
		domain: 'https://yaqeen.me'
	};

	let commentCount = $state();
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
	import Seo from '../../../components/general/seo.svelte';
	let { data } = $props();
	let url;
	function scrollToTopSmooth() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	onMount(() => {
		scrollToTopSmooth();

		// console.log(data);
	});

	function convertLinkToRequestReadable(link) {
		// Encode the link using encodeURIComponent
		var encodedLink = encodeURIComponent(link);

		return encodedLink;
	}

	let encodedTitle = convertLinkToRequestReadable(data.meta.title);
</script>

<svelte:head>
	<Seo
		title={data.meta?.title}
		description={data.meta?.description}
		published={data.meta?.published}
	/>
	{#if data.meta?.canonical}
		<link rel="canonical" href="{data.meta?.canonical}}" />
	{/if}
</svelte:head>

<article in:scale class="mx-auto flex flex-col gap-2">
	<hgroup class=" mb-4 flex items-center rounded-lg w-full flex-col gap-3">
		<div class="flex max-w-md items-center md:max-w-[800px] flex-col gap-2">
			<h1 class="text-5xl text-center text-balance font-extrabold md:text-6xl">
				{data.meta.title}
			</h1>
			<div class="text-sm">
				<p>Published {formatDate(data.meta.date)}</p>
				{#if data.meta.date != data.meta.lastmod}
					<p>Edited {formatDate(data.meta.lastmod)}</p>
				{/if}
			</div>
			<!-- <div class="flex md:items-center">
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
			</div> -->
		</div>
	</hgroup>
	<section class="flex w-full flex-col lg:flex-row article">
		<data.content />

		<aside class="relative w-[400px] hidden md:hidden lg:flex">
			<Ad />
		</aside>
	</section>
	<div class="w-full flex items-center justify-center p-3">
		<div
			class="w-full mt-12 flex justify-between max-w-md items-center border border-b-2 rounded-2xl bg-orange-300 dark:bg-black border-orang dark:border-dark p-4"
		>
			<span>Love it? Share it!</span>
			<div class="flex space-x-3 items-center justify-center">
				<button
					onclick={() => {
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

	<div>
		<h3 class="text-2xl md:text-3xl font-extrabold font-sans mb-6">Comments</h3>
		{#key data}
			<Comment bind:commentLength={commentCount} {entities} />
		{/key}
	</div>
</article>
