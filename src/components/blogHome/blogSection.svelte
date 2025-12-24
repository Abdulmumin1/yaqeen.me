<script>
	import Fa from 'svelte-fa';
	import BlogSGrid from './blogSGrid.svelte';
	import { slide } from 'svelte/transition';
</script>

<div class="w-full flex flex-col h-full p-1" id="blog">
	<div
		class="grid bg-orange-100 grid-cols-1 rounded-lg divide-y divide-y-3 divide-orange-300 dark:divide-stone-700 overflow-hidden p-2 lg:p-5 dark:bg-stone-900"
	>
		<BlogSGrid />
	</div>
</div>
