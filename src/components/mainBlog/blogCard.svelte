<script>
	import { formatDate } from '$lib/js/utils.js';
	import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	// import { slide } from 'svelte/transition';
	export let details;
</script>

<div
	class="w-full min-w-[300px] space-y-3 border rounded-xl border-b-2 h-full p-5 bg-orange-100 dark:bg-stone-800 dark:text-orange-200 border-orang dark:border-dark"
>
	<a href={`blog/${details.slug}`} class="text-2xl lg:text-3xl hover:opacity-80">
		{details.title}</a
	>
	<p>{formatDate(details.date)}</p>
	<!-- <p>{details.description}</p> -->
	<a href={`blog/${details.slug}`} class="py-2 flex items-center gap-3">
		Read more <Fa icon={faArrowTrendUp} /></a
	>
</div>
