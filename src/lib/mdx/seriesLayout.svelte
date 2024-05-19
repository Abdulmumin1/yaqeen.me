<script context="module">
	import a from '../../components/mainBlog/link.svelte';
	import img from '../../components/mainBlog/image.svelte';

	export { a, img };
</script>

<script>
	import Fa from 'svelte-fa';
	import SeriesEpisodes from '../../components/mainBlog/seriesEpisodes.svelte';
	import './styles.css';
	import { faExternalLink } from '@fortawesome/free-solid-svg-icons';

	// import '@fontsource/ibm-plex-mono/latin.css';

	export let categories;
	export let series;
	export let episode;
</script>

<!-- <svelte:head>
	<title>SvelteKit Shiki Syntax Highlighting: Markdown Codeblocks</title>
	<meta
		name="description"
		content="SvelteKit Shiki syntax highlighting: use any VSCode colour theme to accessibly syntax highlight code on your SvelteKit app with line numbers."
	/>
</svelte:head> -->

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
			<slot />
		</main>

		<a href="/blog/series/{series}">
			<h3 class="text-black dark:text-orange-200 flex gap-2">
				<span class="uppercase">{series}</span> Series
				<span class="text-sm"><Fa icon={faExternalLink} /></span>
			</h3>
		</a>

		<div class="mt-16">
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
