<script>
	import Fa from 'svelte-fa';
	import BlogSGrid from './blogSGrid.svelte';
	import { slide } from 'svelte/transition';
</script>

<div class="w-full space-y-4 py-8 flex flex-col" id="blog">
	<h2 class="text-[9px] font-mono opacity-30 uppercase tracking-[0.3em]">writing</h2>
	<BlogSGrid />
</div>
