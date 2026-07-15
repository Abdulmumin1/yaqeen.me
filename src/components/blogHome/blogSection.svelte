<script>
	import BlogSGrid from './blogSGrid.svelte';

	let { data } = $props();
</script>

<div class="w-full space-y-8 flex flex-col" id="blog">
	<h2 class="text-xl md:text-3xl font-serif text-text-main">
		Writing
	</h2>
	<BlogSGrid {data} />
</div>
