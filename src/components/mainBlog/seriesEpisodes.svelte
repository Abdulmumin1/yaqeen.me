<script>
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	let { series, highlight } = $props();

	let loading = $state(true);
	let posts = $state([]);

	function filterObjectsByTagKey(objects, tagKey, query) {
		return objects.filter((object) => {
			return object?.[tagKey] === query.toLowerCase();
		});
	}

	async function loadSeries() {
		const response = await fetch('/blog/api/posts');
		const json = await response.json();
		const filteredPosts = filterObjectsByTagKey(json.allPosts || [], 'series', series);
		return { posts: filteredPosts };
	}

	let page = $state(6);

	function loadMorePage() {
		page += 6;
	}

	onMount(async () => {
		try {
			let res = await loadSeries();
			posts = res.posts;

			loading = false;
		} catch {
			// No list of episodes is not worth an error: the post reads fine without it.
		}
	});
</script>

<!-- The episodes of a series, newest first; the one being read is not a link. -->
{#if !loading}
	<ol class="row-list">
		{#each posts.slice(0, page) as episode, index (episode.slug)}
			<li class="type-ui flex items-baseline gap-3">
				<span class="w-5 shrink-0 text-right text-text-faint tabular-nums">
					{posts.length - index}
				</span>
				{#if highlight !== undefined && Number(episode.episode) === Number(highlight)}
					<span class="text-text-muted" aria-current="true">{episode.title}</span>
				{:else if episode.isExternal}
					<a href={episode.href} target="_blank" rel="noopener noreferrer" class="row-link">
						{episode.title}
					</a>
				{:else}
					<a href={resolve('/blog/[slug]', { slug: episode.slug })} class="row-link">
						{episode.title}
					</a>
				{/if}
			</li>
		{/each}
		{#if posts.length > page}
			<li><button class="tiny-link" onclick={loadMorePage}>load more</button></li>
		{/if}
	</ol>
{/if}
