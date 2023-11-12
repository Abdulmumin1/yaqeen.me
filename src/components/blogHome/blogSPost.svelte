<script>
	import { faAngleRight, faClock } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { formatDate } from '$lib/js/utils.js';

	export let title;
	export let link;
	export let date;
</script>

<div
	class="w-full min-w-[300px] space-y-3 border rounded-xl border-b-2 h-full p-5 bg-orange-100 dark:bg-stone-900 dark:text-orange-200 border-orang dark:border-dark transition-all duration-200 md:hover:scale-105"
>
	<a href={link} class="text-2xl lg:text-3xl hover:opacity-80"> {title}</a>
	<p>Published {formatDate(date)}</p>

	<!-- <p>{details.description}</p> -->
	<!-- <a href={`blog/${details.slug}`} class="py-2 flex items-center gap-3">
		Read more <Fa icon={faArrowTrendUp} /></a
	> -->
</div>
