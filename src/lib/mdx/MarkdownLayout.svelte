<script context="module">
	import a from '../../components/mainBlog/link.svelte';

	export { a };
</script>

<script>
	import './styles.css';

	// import '@fontsource/ibm-plex-mono/latin.css';

	export let categories;
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
				><a href="/category/{tag}">&num;{tag}</a></span
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
	</div>
</div>

<style>
	.container {
		display: flex;
		gap: 20px;
		flex-direction: column;
	}
</style>
