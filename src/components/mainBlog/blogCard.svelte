<script>
	export let details;
</script>

<div class="w-full border-b-2 h-fit p-2 max-w-md border-orang dark:border-dark">
	<a href={`blog/${details.slug}`} class="text-3xl"> {details.title}</a>
	<p>{details.date}</p>
	<p>{details.description}</p>
</div>
