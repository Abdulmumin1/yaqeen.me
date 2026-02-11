<script>
	import {
		faAngleRight,
		faArrowDown,
		faCalendar,
		faClock,
		faEllipsisH
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import BlogSPost from './blogSPost.svelte';
	import { faDev, faHashnode, faMedium, faYoutube } from '@fortawesome/free-brands-svg-icons';
	import { latestPostDetail, others } from '$lib/utils/latestbog.js';
	import { mylinks } from '$lib/utils/randomstore.js';
	import { onMount } from 'svelte';
	import { formatDate } from '$lib/js/utils.js';

	async function loadPost() {
		const response = await fetch('blog/api/postlg');
		const posts = await response.json();
		return posts;
	}
	// loadPost();
	// onMount(async () => {
	// 	// console.log(post);
	// });
</script>

<div class="flex flex-col divide-y divide-primary/10 w-full">
	{#await loadPost()}
		<p class="text-[9px] font-mono opacity-30">loading_posts...</p>
	{:then posts}
		{#each posts.slice(0, 5) as post}
			<BlogSPost
				title={post.title}
				link={`/blog/${post.slug}`}
				date={post.date}
				visual={post?.visual}
			/>
		{/each}
		<div class="pt-4 flex gap-4 text-[9px] font-mono opacity-30">
			<a href="/blog" class="hover:opacity-100 transition-opacity">/all-posts</a>
			<a href="/rss.xml" class="hover:opacity-100 transition-opacity">/rss</a>
		</div>
	{/await}
</div>
