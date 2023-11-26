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

	let url;

	onMount(() => {
		url = window.location.href;
		insertCopyButton(faCopy);
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
</svelte:head>

<article in:scale class="mx-auto flex flex-col gap-2 article">
	<hgroup class=" mb-4 flex rounded-lg w-full flex-col gap-3">
		<div class="flex max-w-md md:max-w-full flex-col">
			<h1 class="text-5xl">{data.meta.title}</h1>
			<p>Published {formatDate(data.meta.date)}</p>
		</div>

		<div class="flex items-center">
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
	</hgroup>
	<section class="flex w-full">
		<div class="w-full">
			<div class="flex gap-3 flex-wrap mb-4">
				{#each data.meta.categories as tag}
					<span class="px-3 py-1 text-sm text-black rounded-full bg-orang dark:bg-dark"
						>&num;{tag}</span
					>
				{/each}
			</div>

			<div class="space-y-5 max-w-[800px] w-full markdown-content">
				<svelte:component this={data.content} />
			</div>
		</div>
		<aside class="relative w-[400px] hidden lg:flex">
			<div
				class="absolute bg-orange-100 divide-y divide-orang dark:divide-dark dark:bg-stone-900 p-4 rounded-xl m-4 flex gap-4 flex-col"
			>
				<div class="flex flex-col gap-2">
					<p class="font-semibold">Signup for Snippetland</p>
					<p class="text-sm">An online HTML/CSS/JS Editor with fast and instant previews!</p>
					<a
						href="https://snippet-bice.vercel.app/play/try"
						target="_blank"
						class="flex text-sm items-center gap-2 bg-orang dark:bg-dark dark:text-stone-950 p-2 rounded-xl w-fit"
						>Try Snippetland <Fa icon={faRightLong} /></a
					>
				</div>
				<div class="flex flex-col gap-2">
					<p class="font-semibold">SleekScroll</p>
					<p class="text-sm">Make Ugly Chromium scrollbars look cool!</p>
					<a
						href="https://github.com/Abdulmumin1/sleek-scroll"
						target="_blank"
						class="flex text-sm items-center gap-2 bg-orang dark:bg-dark dark:text-stone-950 p-2 rounded-xl w-fit"
						>Get Browser Extension <Fa icon={faRightLong} /></a
					>
				</div>
			</div>
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
