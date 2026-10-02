<script>
	import BlogSGrid from './blogSGrid.svelte';

	let { data } = $props();
</script>

<section class="w-full" id="blog" aria-labelledby="writing-heading">
	<h2 id="writing-heading" class="section-heading">Writing</h2>
	<BlogSGrid {data} />
</section>
