<script>
	import { onMount } from 'svelte';

	let { series, highlight } = $props();

	let loading = $state(true);
	let posts = $derived([]);
	// import { error } from '@sveltejs/kit';

	function filterObjectsByTagKey(objects, tagKey, query) {
		return objects.filter((object) => {
			// Ensure case-insensitive matching and handle potential undefined values:
			return object?.[tagKey] === query.toLowerCase();
		});
	}

	async function loadSeries() {
		const response = await fetch('/blog/api/posts');
		let posts = await response.json();
		// console.log(posts);
		// console.log(params.slug);
		posts = filterObjectsByTagKey(posts.posts, 'series', series);
		// console.log(posts);
		return { posts };
		// throw error(404, 'Not found');
	}

	let count = 0;

	function episodeNumber() {
		return count--;
	}

	let page = $state(6);

	function loadMorePage() {
		page += 6;
	}

	onMount(async () => {
		try {
			let res = await loadSeries();
			posts = res.posts;
			count = posts.length;

			loading = false;
		} catch (error) {}
	});
</script>

<div
	class="flex flex-col bg-surface-soft bg-surface-muted rounded outline-[15px] outline outline-orange-200 divide-y-2 divide-primary/10e-200"
>
	{#if !loading}
		{#each posts.slice(0, page) as episode}
			<a href="/blog/{episode.slug}" class="skip px-3 py-4 flex items-center gap-2">
				<div
					class="text-text-main dark:text-text-main bg-primarye-100 bg-surface-soft min-h-10 min-w-10 items-center justify-center flex rounded-full"
				>
					{episodeNumber()}
				</div>

				<div class="text-text-main dark:text-text-main">{episode.title}</div>
			</a>
		{/each}

		{#if posts.length > page}
			<button class="py-2" onclick={loadMorePage}>Load More ...</button>
		{/if}
	{/if}
</div>

<style>
	.highlight {
		background-color: orange;
	}
</style>
