<script>
	import { resolve } from '$app/paths';
	import BlogCard from '../mainBlog/blogCard.svelte';

	let { data } = $props();
</script>

{#if data?.pinnedPosts?.length || data?.regularPosts?.length}
	<!-- One list, pinned posts first, on the same rhythm as the project lists above it. -->
	<div class="row-list">
		{#each [...(data.pinnedPosts ?? []), ...(data.regularPosts ?? []).slice(0, 11)] as post (post.slug)}
			<BlogCard details={post} />
		{/each}
		<div class="flex gap-4">
			<a href={resolve('/blog')} class="tiny-link">/all-posts</a>
			<a href={resolve('/rss.xml')} class="tiny-link">/rss</a>
		</div>
	</div>
{/if}
