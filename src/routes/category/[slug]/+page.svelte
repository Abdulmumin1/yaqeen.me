<script>
	import { scale } from 'svelte/transition';
	import BlogCard from '$components/mainBlog/blogCard.svelte';
	import Seo from '$components/general/seo.svelte';
	import Fa from 'svelte-fa';
	import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { siteOrigin } from '$lib/js/config.js';

	let { data } = $props();

	let posts = $derived(data.posts);
	let latest = $derived(posts[0]);
	let categoryName = $derived($page.params.slug);
	let pageTitle = $derived(`Category: ${categoryName} | Abdulmumin Yaqeen`);
	let pageDescription = $derived(`Posts in category ${categoryName}`);
	let canonical = $derived(`${siteOrigin}${$page.url.pathname}`);
	let pagelength = 6;

	let currentPage = $state(0);
	let currentPageData = $derived(posts.slice(1).slice(currentPage, currentPage + pagelength));

	let showPagination = $derived(posts.length - 1 > pagelength);
	let muteNext = $derived(currentPage + pagelength >= posts.length - 1);
	let mutePrev = $derived(currentPage === 0);

	function scrollToTopSmooth() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	function next() {
		if (!muteNext) {
			currentPage += pagelength;
			scrollToTopSmooth();
		}
	}

	function prev() {
		if (!mutePrev) {
			currentPage -= pagelength;
			scrollToTopSmooth();
		}
	}
</script>

<svelte:head>
	<Seo title={pageTitle} description={pageDescription} {canonical} robots="noindex, follow" />
</svelte:head>

<section in:scale class="max-w-2xl mx-auto px-6 py-8">
	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-2">
			<p class="text-[9px] font-mono uppercase tracking-[0.3em] opacity-30">category</p>
			<h1 class="text-sm font-bold text-primary uppercase tracking-widest">{$page.params.slug}</h1>
		</div>

		{#if latest}
			<div class="flex flex-col gap-4">
				<p class="text-[9px] font-mono uppercase tracking-[0.3em] opacity-30">
					{latest?.pinned ? 'pinned' : 'latest'}
				</p>
				<BlogCard details={latest} latest={true} />
			</div>
		{/if}

		<div class="flex flex-col gap-4">
			<p class="text-[9px] font-mono uppercase tracking-[0.3em] opacity-30">more-posts</p>
			<div class="flex flex-col divide-y divide-primary/10">
				{#each currentPageData as post (post.slug)}
					<BlogCard details={post} />
				{/each}
			</div>
		</div>

		{#if showPagination}
			<div class="flex justify-between items-center pt-4">
				<button
					onclick={prev}
					disabled={mutePrev}
					class="text-xs opacity-60 hover:opacity-100 disabled:opacity-20 transition-opacity flex items-center gap-1"
				>
					<Fa icon={faAngleLeft} /> prev
				</button>
				<button
					onclick={next}
					disabled={muteNext}
					class="text-xs opacity-60 hover:opacity-100 disabled:opacity-20 transition-opacity flex items-center gap-1"
				>
					next <Fa icon={faAngleRight} />
				</button>
			</div>
		{/if}
	</div>
</section>
