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
		description="Articles on software development, cybersecurity, dev tools, and building things — by Abdulmumin Yaqeen."
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

<section class="page">
	<h1 class="sr-only">Writing</h1>
	<div class="grid gap-(--gap-section)">
		{#if pinnedPosts.length}
			<div>
				<h2 class="section-heading">Pinned</h2>
				<div class="row-list">
					{#each pinnedPosts as post (post.slug)}
						<BlogCard details={post} />
					{/each}
				</div>
			</div>
		{/if}

		{#if latest || posts.length}
			<div>
				{#if latest}
					<h2 class="section-heading">Latest</h2>
				{/if}
				<div class="row-list">
					{#if latest}
						<BlogCard details={latest} />
					{/if}
					{#each posts as post (post.slug)}
						<BlogCard details={post} />
					{/each}
				</div>
			</div>
		{/if}

		{#if showPagination}
			<div class="type-small flex items-center justify-between text-text-muted">
				{#if currentPage > 1}
					<button
						onclick={() => loadPage(currentPage - 1)}
						class="flex items-center gap-1 transition-colors hover:text-text-main"
					>
						<Fa icon={faAngleLeft} /> prev
					</button>
				{:else}
					<span></span>
				{/if}
				<span class="text-text-faint">{currentPage} / {activeData.totalPages}</span>
				{#if currentPage < activeData.totalPages}
					<button
						onclick={() => loadPage(currentPage + 1)}
						class="flex items-center gap-1 transition-colors hover:text-text-main"
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
