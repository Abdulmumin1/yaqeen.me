<script>
	import './styles.css';
	// import '@fontsource/ibm-plex-mono/latin.css';
</script>

<!-- <svelte:head>
	<title>SvelteKit Shiki Syntax Highlighting: Markdown Codeblocks</title>
	<meta
		name="description"
		content="SvelteKit Shiki syntax highlighting: use any VSCode colour theme to accessibly syntax highlight code on your SvelteKit app with line numbers."
	/>
</svelte:head> -->
<main class="container">
	<!-- <h1 class="heading">SvelteKit Shiki Code Highlighting</h1> -->
	<slot />
</main>

<style>
	.container {
		display: flex;
		gap: 20px;
		flex-direction: column;
	}
	.heading {
		text-align: center;
	}
</style>
