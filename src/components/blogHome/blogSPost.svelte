<script>
	import { faAngleRight, faClock } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { formatDate } from '$lib/js/utils.js';

	export let title;
	export let link;
	export let date;
	export let visual;
</script>

<div
	class="w-full space-y-3 border rounded-xl border-b-2 h-full p-5 bg-orange-100 dark:bg-stone-900 dark:text-orange-200 border-orang dark:border-dark transition-all duration-200 md:hover:scale-105"
>
	<a href={link} class="text-2xl lg:text-3xl hover:opacity-80"> {title}</a>
	<p>Published {formatDate(date)}</p>
	{#if visual}
		<div class="text-sm bg-orange-200 dark:bg-stone-800 rounded-3xl w-fit px-2">
			Interactive Blog
		</div>
	{/if}
	<!-- <p>{details.description}</p> -->
	<!-- <a href={`blog/${details.slug}`} class="py-2 flex items-center gap-3">
		Read more <Fa icon={faArrowTrendUp} /></a
	> -->
</div>
