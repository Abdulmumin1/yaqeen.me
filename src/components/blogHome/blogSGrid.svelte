<script>
	import { resolve } from '$app/paths';
	import BlogCard from '../mainBlog/blogCard.svelte';
	import BlogSPost from './blogSPost.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col w-full">
	{#if data?.pinnedPosts?.length || data?.regularPosts?.length}
		{#if data.pinnedPosts?.length}
			<div class="flex flex-col">
				<div class="flex flex-col">
					{#each data.pinnedPosts as post (post.slug)}
						<BlogCard details={post} />
					{/each}
				</div>
			</div>
		{/if}

		{#if data.regularPosts?.length}
			<div class="flex flex-col gap-3">
				<div class="flex flex-col">
					{#each data.regularPosts.slice(0, 11) as post (post.slug)}
						<BlogCard details={post} />
					{/each}
				</div>
			</div>
		{/if}

		<div class="pt-4 flex gap-4 text-[9px] font-mono text-text-muted">
			<a href={resolve('/blog')} class="hover:text-text-main transition-colors">/all-posts</a>
			<a href={resolve('/rss.xml')} class="hover:text-text-main transition-colors">/rss</a>
		</div>
	{/if}
</div>
