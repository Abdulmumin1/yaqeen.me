<script>
	export let data;
	import { formatDate } from '$lib/js/utils.js';

	import { page } from '$app/stores';
	import Fa from 'svelte-fa';
	import {
		faFacebook,
		faHackerNews,
		faLinkedin,
		faReddit,
		faTwitter,
		faWhatsapp
	} from '@fortawesome/free-brands-svg-icons';
	import { faCopy } from '@fortawesome/free-solid-svg-icons';

	function copyUrlToClipboard() {
		var url = window.location.href;
		navigator.clipboard
			.writeText(url)
			.then(() => {
				console.log('URL copied to clipboard:', url);
			})
			.catch((error) => {
				console.error('Failed to copy URL to clipboard:', error);
			});
	}
</script>

<svelte:head>
	<title>{data.meta.title}</title>
</svelte:head>
<article class="mx-auto flex flex-col gap-4">
	<hgroup class="text-center p-6">
		<h1 class="text-5xl">{data.meta.title}</h1>
		<!-- <p>Published at {formatDate(data.meta.date)}</p> -->
	</hgroup>
	<div class="flex gap-3">
		{#each data.meta.categories as tag}
			<span class="px-3 py-1 text-black rounded-full bg-orang dark:bg-dark">&num;{tag}</span>
		{/each}
	</div>

	<div class="space-y-6">
		<svelte:component this={data.content} />
	</div>
	<div class="w-full flex items-center justify-center p-3">
		<div
			class="w-full flex justify-between max-w-md items-center border border-b-2 rounded-lg border-orang dark:border-dark p-4"
		>
			<span>Love it? Share it!</span>
			<div class="flex space-x-3 items-center justify-center">
				<span><Fa icon={faCopy} /></span>
				<a
					href="https://twitter.com/share?url={window.location
						.href}%3Fref%3Dtwitter-share&amp;text={data.meta.title}"
					target="_blank"
					rel="noopener"
				>
					<span><Fa icon={faTwitter} /></span>
				</a>
				<a
					href="http://www.reddit.com/submit?url={window.location.href}&amp;title={data.meta.title}"
					target="_blank"
					rel="noopener"
				>
					<span><Fa icon={faReddit} /></span>
				</a>
				<a
					href="https://www.linkedin.com/cws/share?url={window.location.href}"
					target="_blank"
					rel="noopener"
				>
					<span><Fa icon={faLinkedin} /></span>
				</a>
				<a
					href="http://news.ycombinator.com/submitlink?u={window.location.href}&amp;t={data.meta
						.title}"
					target="_blank"
					rel="noopener"
				>
					<Fa icon={faHackerNews} />
				</a>
				<a
					href="https://www.facebook.com/sharer/sharer.php?u={window.location.href}"
					target="_blank"
					rel="noopener"
				>
					<Fa icon={faFacebook} />
				</a>
				<a
					href="https://api.whatsapp.com/send?text={data.meta.title}%20{window.location.href}"
					target="_blank"
					rel="noopener"
				>
					<button on:click={copyUrlToClipboard}><Fa icon={faWhatsapp} /></button>
				</a>
			</div>
		</div>
	</div>
</article>
