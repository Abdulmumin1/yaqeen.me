<script>
	import { scale } from 'svelte/transition';
	import BlogCard from '../../components/mainBlog/blogCard.svelte';
	import Fa from 'svelte-fa';
	import { faAngleLeft, faAngleRight, faArrowRight } from '@fortawesome/free-solid-svg-icons';
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
	<!-- Meta Tags Generated via https://www.opengraph.xyz -->

	<!-- HTML Meta Tags -->
	<title>Blog - Abdulmumin Yaqeen</title>
	<meta
		name="description"
		content="Visual powered blog - Get the best learning experience with interactive element to showcase concepts"
	/>

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://www.yaqeen.me" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Abdulmumin Yaqeen" />
	<meta
		property="og:description"
		content="Visual powered blog - Get the best learning experience with interactive element to showcase concepts"
	/>
	<meta property="og:image" content="https://i.ibb.co/nPW10cf/abdul.png" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="yaqeen.me" />
	<meta property="twitter:url" content="https://www.yaqeen.me" />
	<meta name="twitter:title" content="Abdulmumin Yaqeen" />
	<meta
		name="twitter:description"
		content="Visual powered blog - Get the best learning experience with interactive elements to showcase concepts"
	/>
	<meta name="twitter:image" content="https://i.ibb.co/nPW10cf/abdul.png" />

	{#if data.hasPrev}
		<link rel="prev" href="/blog?page={data.currentPage - 1}" />
	{/if}
	{#if data.hasNext}
		<link rel="next" href="/blog?page={data.currentPage + 1}" />
	{/if}
</svelte:head>

<section class="min-h-screen mt-20">
	<article class="w-full flex justify-center items-center flex-col">
		<div class="max-w-[900px] flex flex-col w-full p-4 md:p-6 gap-4">
			<div class="flex flex-wrap gap-4">
				<a
					class="bg-orange-100 border flex gap-2 items-center justify-center w-fit py-2 px-3 rounded-full dark:bg-stone-900/60 border-orang dark:border-dark"
					href="/blog/series/uth"
					>Under the hood series <span class="-rotate-12"><Fa icon={faArrowRight} /></span></a
				>

				<a
					class="bg-orange-100 border flex gap-2 items-center justify-center w-fit py-2 px-3 rounded-full dark:bg-stone-900/60 border-orang dark:border-dark"
					href="/category/product launch">Product Lauches</a
				>
				<a
					class="bg-orange-100 border flex gap-2 items-center justify-center w-fit py-2 px-3 rounded-full dark:bg-stone-900/60 border-orang dark:border-dark"
					href="/blog/git+for+beginners">Git Crash Course</a
				>

				<a
					class="bg-orange-100 border flex gap-2 items-center justify-center w-fit py-2 px-3 rounded-full dark:bg-stone-900/60 border-orang dark:border-dark"
					href="https://devcanvas.dev/blog">CSS articles</a
				>
			</div>
			<div class="text-4xl flex flex-col gap-3">
				<p>Latest post</p>
				<BlogCard details={latest} latest={true} />
			</div>
			<div
				class="grid bg-orange-100 grid-cols-1 rounded-lg divide-y divide-y-3 divide-orange-300 dark:divide-stone-700 overflow-hidden p-2 lg:p-5 dark:bg-stone-900 [&>*:first-child]:rounded-t-lg [&>*:last-child]:rounded-b-lg"
			>
				{#each currentPageData as post}
					<BlogCard details={post} />
				{/each}
			</div>

			{#if showPagination}
				<div class="flex justify-between w-full">
					{#if currentPage > 1}
						<a
							href="/blog?page={currentPage - 1}"
							onclick={() => loadPage(currentPage - 1)}
							class="bg-orange-200 dark:bg-stone-900/60 border border-orang dark:border-dark w-32 py-2 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-300"
							><Fa icon={faAngleLeft} /> prev</a
						>
					{:else}
						<span class="w-32"></span>
					{/if}
					{#if currentPage < data.totalPages}
						<a
							href="/blog?page={currentPage + 1}"
							onclick={() => loadPage(currentPage + 1)}
							class="bg-orange-200 dark:bg-stone-900/60 border border-orang dark:border-dark w-32 py-2 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-300"
							><span class="">next</span> &nbsp; <Fa icon={faAngleRight} /></a
						>
					{:else}
						<span class="w-32"></span>
					{/if}
				</div>
			{/if}
		</div>

		<div class="flex flex-col gap-6 px-6">
			<!-- <h4 class="text-sm">
				Visual powered blog - Get the best learning experience with interactive elements that
				showcase concepts 🫶.
			</h4> -->

			<!-- <div
				class="p-12 max-w-3xl bg-orange-100 dark:bg-stone-900 flex items-center justify-center flex-col gap-2 rounded-xl border-2 border-orange-200 dark:border-stone-800"
			>
				<h4>Subscribe to my newsletter!</h4>
				<p class="text-sm">* Every tips & tricks in your Inbox 🫶</p>
				<form method="post" class="flex flex-col md:flex-row gap-3">
					<input
						type="email"
						name="email"
						placeholder="name@example.com"
						class="p-2 bg-orange-200 dark:bg-stone-800 rounded-lg"
					/>

					<button
						type="submit"
						disabled="true"
						class="bg-orang dark:bg-dark text-black px-2 rounded-lg"
						>Subscribe
					</button>
				</form>
			</div> -->
		</div>
	</article>
</section>
