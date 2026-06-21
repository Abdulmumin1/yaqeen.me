<script>
	import { resolve } from '$app/paths';
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
		posts = filterObjectsByTagKey(posts.allPosts, 'series', series);
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
	class="flex flex-col rounded border border-border/40 bg-surface-soft shadow-sm divide-y divide-border/50"
>
	{#if !loading}
		{#each posts.slice(0, page) as episode (episode.slug)}
			{#if episode.isExternal}
				<button
					type="button"
					onclick={() => window.open(episode.href, '_blank', 'noopener,noreferrer')}
					class="skip w-full text-left px-3 py-4 flex items-center gap-2"
				>
					<div
						class="text-accent bg-surface-muted min-h-10 min-w-10 items-center justify-center flex rounded-full border border-border/40"
					>
						{episodeNumber()}
					</div>

					<div class="text-text-main hover:text-accent transition-colors">{episode.title}</div>
				</button>
			{:else}
				<a
					href={resolve('/blog/[slug]', { slug: episode.slug })}
					class="skip px-3 py-4 flex items-center gap-2"
				>
					<div
						class="text-accent bg-surface-muted min-h-10 min-w-10 items-center justify-center flex rounded-full border border-border/40"
					>
						{episodeNumber()}
					</div>

					<div class="text-text-main hover:text-accent transition-colors">{episode.title}</div>
				</a>
			{/if}
		{/each}

		{#if posts.length > page}
			<button
				class="py-2 text-text-muted hover:text-accent transition-colors"
				onclick={loadMorePage}>Load More ...</button
			>
		{/if}
	{/if}
</div>
