<script>
	export let data;
	import { formatDate } from '$lib/js/utils.js';
</script>

<svelte:head>
	<title>{data.meta.title}</title>
</svelte:head>
<article class="mx-auto flex flex-col gap-4">
	<hgroup class="text-center p-6">
		<h1 class="text-5xl">{data.meta.title}</h1>
		<!-- <p>Published at {formatDate(data.meta.date)}</p> -->
	</hgroup>
	<div class="flex gap-3">
		{#each data.meta.categories as tag}
			<span class="px-3 py-1 text-black rounded-full bg-orang dark:bg-dark">&num;{tag}</span>
		{/each}
	</div>

	<div>
		<svelte:component this={data.content} />
	</div>
</article>
