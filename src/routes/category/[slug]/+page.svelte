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
	let pageDescription = $derived(
		`Articles by Abdulmumin Yaqeen in the "${categoryName}" category.`
	);
	let canonical = $derived(`${siteOrigin}${$page.url.pathname}`);
	let pagelength = 6;

	let currentPage = $state(0);
	let currentPageData = $derived(posts.slice(1).slice(currentPage, currentPage + pagelength));

	let showPagination = $derived(posts.length - 1 > pagelength);
	let muteNext = $derived(currentPage + pagelength >= posts.length - 1);
	let mutePrev = $derived(currentPage === 0);

	function scrollToTop() {
		window.scrollTo(0, 0);
	}

	function next() {
		if (!muteNext) {
			currentPage += pagelength;
			scrollToTop();
		}
	}

	function prev() {
		if (!mutePrev) {
			currentPage -= pagelength;
			scrollToTop();
		}
	}
</script>

<svelte:head>
	<Seo title={pageTitle} description={pageDescription} {canonical} robots="noindex, follow" />
</svelte:head>

<section in:scale class="page">
	<div class="grid gap-(--gap-section)">
		<div>
			<p class="type-tiny font-mono tracking-[0.08em] text-text-faint uppercase">category</p>
			<h1 class="type-title text-text-main">{$page.params.slug}</h1>
		</div>

		{#if latest}
			<div>
				<h2 class="section-heading">{latest?.pinned ? 'Pinned' : 'Latest'}</h2>
				<div class="row-list">
					<BlogCard details={latest} />
				</div>
			</div>
		{/if}

		<div>
			<h2 class="section-heading">More posts</h2>
			<div class="row-list">
				{#each currentPageData as post (post.slug)}
					<BlogCard details={post} />
				{/each}
			</div>
		</div>

		{#if showPagination}
			<div class="type-small flex items-center justify-between text-text-muted">
				<button
					onclick={prev}
					disabled={mutePrev}
					class="flex items-center gap-1 transition-colors hover:text-text-main disabled:opacity-20"
				>
					<Fa icon={faAngleLeft} /> prev
				</button>
				<button
					onclick={next}
					disabled={muteNext}
					class="flex items-center gap-1 transition-colors hover:text-text-main disabled:opacity-20"
				>
					next <Fa icon={faAngleRight} />
				</button>
			</div>
		{/if}
	</div>
</section>
