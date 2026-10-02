<script module>
	import a from '../../components/mainBlog/link.svelte';
	import img from '../../components/mainBlog/image.svelte';

	export { a, img };
</script>

<script>
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import SeriesEpisodes from '../../components/mainBlog/seriesEpisodes.svelte';
	import './styles.css';
	import { renderMermaid } from '../utils/mermaid.js';
	import { copyCode } from './copyCode.js';
	import MermaidModal from '../../components/mainBlog/mermaidModal.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {any} categories - import '@fontsource/ibm-plex-mono/latin.css';
	 * @property {any} series
	 * @property {any} episode
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { categories, series, episode, children } = $props();

	let main;

	onMount(() => {
		const stopDiagrams = renderMermaid(main);
		const stopCopying = copyCode(main);
		return () => {
			stopDiagrams();
			stopCopying();
		};
	});
</script>

<div class="w-full">
	<!-- <div class="flex gap-3 flex-wrap mb-4">
		{#each categories as tag (tag)}
			<span class="text-base rounded-lg text-accent"
				><a href={resolve('/category/[slug]', { slug: tag })}>&num;&nbsp;{tag}</a></span
			>
		{/each}
	</div> -->
	<!-- How everything in here looks is in app.css, under "Articles". -->
	<div class="markdown-content w-full">
		<main bind:this={main}>
			{@render children?.()}
		</main>
	</div>

	<!-- The rest of the series this post belongs to. -->
	<section class="mt-(--gap-section) border-t border-border pt-10">
		<h2 class="section-heading">
			<a href={resolve('/blog/series/[slug]', { slug: series })} class="row-link">
				<span class="uppercase">{series}</span> series
			</a>
		</h2>
		<SeriesEpisodes {series} highlight={episode} />
	</section>

	<MermaidModal />
</div>
