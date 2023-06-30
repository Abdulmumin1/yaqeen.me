<script>
	import { formatDate } from '$lib/js/utils.js';
	export let details;
</script>

<div class="w-full border-b-2 h-fit p-2 border-orang dark:border-dark">
	<a href={`blog/${details.slug}`} class="text-2xl lg:text-3xl"> {details.title}</a>
	<p>{formatDate(details.date)}</p>
	<!-- <p>{details.description}</p> -->
</div>
