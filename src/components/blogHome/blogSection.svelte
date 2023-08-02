<script>
	import Fa from 'svelte-fa';
	import BlogSGrid from './blogSGrid.svelte';
	import { slide } from 'svelte/transition';
</script>

<div
	class="flex flex-col h-full p-5 m-1 border-t-4 border-dotted border-orang dark:border-dark"
	id="blog"
>
	<h2 class="lg:text-4xl text-3xl font-visby_bold font-bold mb-2">Latest Post</h2>

	<BlogSGrid />
</div>
