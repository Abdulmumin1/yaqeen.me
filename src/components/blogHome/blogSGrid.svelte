<script>
	import { resolve } from '$app/paths';
	import BlogSPost from './blogSPost.svelte';

	async function loadPosts() {
		const response = await fetch('/blog/api/posts');
		return response.json();
	}

	const postsPromise = loadPosts();
</script>

<div class="flex flex-col w-full">
	{#await postsPromise}
		<p class="text-[9px] font-mono text-text-muted">loading_posts...</p>
	{:then posts}
		{#if posts.pinnedPosts?.length}
			<div class="flex flex-col">
				<div class="flex flex-col">
					{#each posts.pinnedPosts as post (post.slug)}
						<BlogSPost
							title={post.title}
							link={post.href || `/blog/${post.slug}`}
							slug={post.slug}
							date={post.date}
							visual={post?.visual}
							external={post.isExternal}
							pinned={post.pinned}
						/>
					{/each}
				</div>
			</div>
		{/if}

		{#if posts.regularPosts?.length}
			<div class="flex flex-col gap-3">
				<div class="flex flex-col divide-y divide-primary/10">
					{#each posts.regularPosts.slice(0, 11) as post (post.slug)}
						<BlogSPost
							title={post.title}
							link={post.href || `/blog/${post.slug}`}
							slug={post.slug}
							date={post.date}
							visual={post?.visual}
							external={post.isExternal}
							pinned={post.pinned}
						/>
					{/each}
				</div>
			</div>
		{/if}

		<div class="pt-4 flex gap-4 text-[9px] font-mono text-text-muted">
			<a href={resolve('/blog')} class="hover:text-text-main transition-colors">/all-posts</a>
			<a href={resolve('/rss.xml')} class="hover:text-text-main transition-colors">/rss</a>
		</div>
	{/await}
</div>
