<script>
	import BlogCard from '../../components/mainBlog/blogCard.svelte';
	import Fa from 'svelte-fa';
	import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
	import { writable } from 'svelte/store';
	let { data } = $props();

	let latest = data.latest;
	let currentPage = $state(data.currentPage);
	let postsStore = writable(data.posts);
	let currentPageData = $derived($postsStore);
	let showPagination = data.totalPages > 1;

	async function loadPage(page) {
		const response = await fetch(`/blog/api/posts?page=${page}`);
		const newData = await response.json();
		postsStore.set(newData.posts);
		currentPage = page;
		window.history.pushState({}, '', `/blog?page=${page}`);
	}
</script>

<svelte:head>
	<title>Blog - Abdulmumin Yaqeen</title>
	<meta name="description" content="Writings on code, security, and building things" />
	<meta property="og:url" content="https://www.yaqeen.me" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Abdulmumin Yaqeen" />
	<meta property="og:description" content="Writings on code, security, and building things" />
	<meta property="og:image" content="https://i.ibb.co/nPW10cf/abdul.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="yaqeen.me" />
	<meta property="twitter:url" content="https://www.yaqeen.me" />
	<meta name="twitter:title" content="Abdulmumin Yaqeen" />
	<meta name="twitter:description" content="Writings on code, security, and building things" />
	<meta name="twitter:image" content="https://i.ibb.co/nPW10cf/abdul.png" />
	{#if data.hasPrev}
		<link rel="prev" href="/blog?page={data.currentPage - 1}" />
	{/if}
	{#if data.hasNext}
		<link rel="next" href="/blog?page={data.currentPage + 1}" />
	{/if}
</svelte:head>

<section class="max-w-2xl mx-auto px-6 py-8">
	<div class="flex flex-col gap-6">

		<div class="flex flex-col gap-4">
			<p class="text-[9px] font-mono uppercase tracking-[0.3em] opacity-30">latest</p>
			<BlogCard details={latest} latest={true} />
		</div>

		<div class="flex flex-col gap-4">
			<p class="text-[9px] font-mono uppercase tracking-[0.3em] opacity-30">all-posts</p>
			<div class="flex flex-col divide-y divide-orang/10 dark:divide-dark/10">
				{#each currentPageData as post}
					<BlogCard details={post} />
				{/each}
			</div>
		</div>

		{#if showPagination}
			<div class="flex justify-between items-center pt-4">
				{#if currentPage > 1}
					<button
						onclick={() => loadPage(currentPage - 1)}
						class="text-xs opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
					>
						<Fa icon={faAngleLeft} /> prev
					</button>
				{:else}
					<span></span>
				{/if}
				<span class="text-[10px] font-mono opacity-30">{currentPage} / {data.totalPages}</span>
				{#if currentPage < data.totalPages}
					<button
						onclick={() => loadPage(currentPage + 1)}
						class="text-xs opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
					>
						next <Fa icon={faAngleRight} />
					</button>
				{:else}
					<span></span>
				{/if}
			</div>
		{/if}
	</div>
</section>
