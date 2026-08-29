<script module>
	import a from '../../components/mainBlog/link.svelte';
	import img from '../../components/mainBlog/image.svelte';

	export { a, img };
</script>

<script>
	import { onMount } from 'svelte';
	import './styles.css';
	import { renderMermaid } from '../utils/mermaid.js';

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

	onMount(() => renderMermaid(main));
</script>

<div class="w-full max-w-2xl mx-auto {isPoetry ? 'poetry-layout' : ''}">
	<!-- <div class="flex gap-2 flex-wrap mb-4">
		{#each categories as tag}
			<span class="text-[10px] font-mono text-text-muted">
				<a href="/category/{tag}" class="hover:text-text-main transition-colors">&num;{tag}</a>
			</span>
		{/each}
	</div> -->

	<div class="space-y-4 w-full markdown-content text-sm text-text-muted">
		<main class="container" bind:this={main}>
			{@render children?.()}
		</main>
	</div>
</div>

<style>
	.container {
		display: flex;
		gap: 12px;
		flex-direction: column;
	}
</style>
