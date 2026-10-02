<script module>
	import a from '../../components/mainBlog/link.svelte';
	import img from '../../components/mainBlog/image.svelte';

	export { a, img };
</script>

<script>
	import { onMount } from 'svelte';
	import './styles.css';
	import { renderMermaid } from '../utils/mermaid.js';
	import { copyCode } from './copyCode.js';
	import MermaidModal from '../../components/mainBlog/mermaidModal.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {any} categories - import '@fontsource/ibm-plex-mono/latin.css';
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { categories = [], children } = $props();

	const isPoetry = $derived(
		categories?.some((c) => ['peotry', 'poetry', 'peom', 'poem'].includes(c.toLowerCase()))
	);

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

<div class="w-full {isPoetry ? 'poetry-layout' : ''}">
	<!-- <div class="flex gap-2 flex-wrap mb-4">
		{#each categories as tag}
			<span class="text-[10px] font-mono text-text-muted">
				<a href="/category/{tag}" class="hover:text-text-main transition-colors">&num;{tag}</a>
			</span>
		{/each}
	</div> -->

	<!-- How everything in here looks is in app.css, under "Articles". -->
	<div class="markdown-content w-full">
		<main bind:this={main}>
			{@render children?.()}
		</main>
	</div>

	<MermaidModal />
</div>
