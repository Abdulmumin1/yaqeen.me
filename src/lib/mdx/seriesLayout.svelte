<script module>
	import a from '../../components/mainBlog/link.svelte';
	import img from '../../components/mainBlog/image.svelte';

	export { a, img };
</script>

<script>
	import Fa from 'svelte-fa';
	import SeriesEpisodes from '../../components/mainBlog/seriesEpisodes.svelte';
	import './styles.css';
	import { faExternalLink } from '@fortawesome/free-solid-svg-icons';

	/**
	 * @typedef {Object} Props
	 * @property {any} categories - import '@fontsource/ibm-plex-mono/latin.css';
	 * @property {any} series
	 * @property {any} episode
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let {
		categories,
		series,
		episode,
		children
	} = $props();
</script>


<div class="w-full">
	<div class="flex gap-3 flex-wrap mb-4">
		{#each categories as tag}
			<span class=" text-base rounded-lg text-orang dark:text-dark"
				><a href="/category/{tag}">&num;&nbsp;{tag}</a></span
			>
		{/each}
	</div>
	<div
		class="space-y-5 max-w-[800px] w-full markdown-content text-base
	"
	>
		<main class="container">
			<!-- <h1 class="heading">SvelteKit Shiki Code Highlighting</h1> -->
			{@render children?.()}
		</main>

		<div class="pt-6 flex gap-3 flex-col">
			<a href="/blog/series/{series}" class="skip">
				<h3 class=" flex gap-2">
					<span class="uppercase">{series}</span> Series
					<span class="text-sm"><Fa icon={faExternalLink} /></span>
				</h3>
			</a>

			<SeriesEpisodes {series} highlight={episode} />
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		gap: 20px;
		flex-direction: column;
	}
</style>
