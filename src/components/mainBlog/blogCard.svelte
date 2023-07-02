<script>
	import { formatDate } from '$lib/js/utils.js';
	// import { slide } from 'svelte/transition';
	export let details;
</script>

<div class="w-full h-fit p-2 border-orang dark:border-dark">
	<a href={`blog/${details.slug}`} class="text-2xl lg:text-3xl"> {details.title}</a>
	<p>{formatDate(details.date)}</p>
	<!-- <p>{details.description}</p> -->
</div>
