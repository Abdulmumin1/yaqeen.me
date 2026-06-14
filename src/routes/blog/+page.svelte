<script>
	import BlogCard from '../../components/mainBlog/blogCard.svelte';
	import Seo from '$components/general/seo.svelte';
	import { defaultSocialImage, siteOrigin } from '$lib/js/config.js';
	import Fa from 'svelte-fa';
	import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

	let { data } = $props();

	let clientData = $state(null);
	let activeData = $derived(clientData ?? data);
	let pinnedPosts = $derived(activeData.pinnedPosts ?? []);
	let latest = $derived(activeData.latestRegular ?? null);
	let currentPage = $derived(activeData.currentPage);
	let posts = $derived(activeData.posts ?? []);
	let showPagination = $derived(activeData.totalPages > 1);
	let canonical = $derived(
		currentPage > 1 ? `${siteOrigin}/blog?page=${currentPage}` : `${siteOrigin}/blog`
	);
	let robots = $derived(currentPage > 1 ? 'noindex, follow' : 'index, follow');
	let pageTitle = $derived(
		currentPage > 1 ? `Blog - Page ${currentPage} | Abdulmumin Yaqeen` : 'Blog | Abdulmumin Yaqeen'
	);

	async function loadPage(page) {
		const response = await fetch(`/blog/api/posts?page=${page}`);
		const newData = await response.json();
		clientData = newData;
		window.history.pushState({}, '', `/blog?page=${page}`);
	}
</script>

<svelte:head>
	<Seo
		title={pageTitle}
		description="Writings on code, security, and building things."
		{canonical}
		image={defaultSocialImage}
		{robots}
	/>
	{#if activeData.hasPrev}
		<link rel="prev" href="/blog?page={activeData.currentPage - 1}" />
	{/if}
	{#if activeData.hasNext}
		<link rel="next" href="/blog?page={activeData.currentPage + 1}" />
	{/if}
</svelte:head>

<section class="max-w-2xl mx-auto px-6 py-12 md:py-24">
	<div class="flex flex-col">
		{#if pinnedPosts.length}
			<div class="flex flex-col gap-1">
				<p class="text-3xl font-serif text-stone-900 border-b border-stone-200 pb-2 w-fit pr-8 mb-2">Pinned</p>
				<div class="flex flex-col">
					{#each pinnedPosts as post (post.slug)}
						<BlogCard details={post} />
					{/each}
				</div>
			</div>
		{/if}

		{#if latest}
			<p class="text-3xl font-serif text-stone-900 border-b border-stone-200 pb-2 w-fit pr-8 mt-8 mb-2">Latest</p>
			<div class="flex flex-col">
				<BlogCard details={latest} latest={true} />
			</div>
		{/if}

		{#if posts.length}
			<div class="flex flex-col gap-4">
				<div class="flex flex-col divide-y divide-primary/10">
					{#each posts as post (post.slug)}
						<BlogCard details={post} />
					{/each}
				</div>
			</div>
		{/if}

		{#if showPagination}
			<div class="flex justify-between items-center pt-4">
				{#if currentPage > 1}
					<button
						onclick={() => loadPage(currentPage - 1)}
						class="text-sm text-stone-500 hover:text-accent transition-colors flex items-center gap-1"
					>
						<Fa icon={faAngleLeft} /> prev
					</button>
				{:else}
					<span></span>
				{/if}
				<span class="text-sm font-serif text-stone-400"
					>{currentPage} / {activeData.totalPages}</span
				>
				{#if currentPage < activeData.totalPages}
					<button
						onclick={() => loadPage(currentPage + 1)}
						class="text-sm text-stone-500 hover:text-accent transition-colors flex items-center gap-1"
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
