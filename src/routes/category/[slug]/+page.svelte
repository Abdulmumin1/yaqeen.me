<script>
	import { scale, slide } from 'svelte/transition';
	import BlogCard from '$components/mainBlog/blogCard.svelte';
	import Fa from 'svelte-fa';
	import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	export let data;

	let latest = data.posts[0];
	data.posts.shift();
	let pagelength = 6;
	let showPagination = data.posts && data.posts.length > pagelength; // Updated condition for showPagination
	let currentPage = 0;
	let currentPageData = [];
	let muteNext = false;
	let mutePrev = true;

	function scrollToTopSmooth() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	onMount(() => {
		// scrollToTopSmooth();
		updateCurrentPageData(); // Move the logic to update current page data into a function
	});

	function updateCurrentPageData() {
		currentPageData = data.posts.slice(currentPage, currentPage + pagelength);

		scrollToTopSmooth();
	}

	function next() {
		if (currentPage + pagelength < data.posts.length) {
			currentPage += pagelength;
			updateCurrentPageData();
		} else {
			muteNext = true; // Disable next button when at the last page
		}
		mutePrev = false; // Reset mutePrev when navigating to the next page
	}

	function prev() {
		if (currentPage - pagelength >= 0) {
			currentPage -= pagelength;
			updateCurrentPageData();
		} else {
			mutePrev = true; // Disable prev button when at the first page
		}
		muteNext = false; // Reset muteNext when navigating to the previous page
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
</svelte:head>

<section in:scale class="min-h-screen mt-20">
	<article class="<w-full flex justify-center items-center flex-col">
		<div class="max-w-[900px] flex flex-col w-full p-4 md:p-6 gap-4">
			<div class="text-4xl flex flex-col gap-3">
				<p>Newest Article Tagged - {$page.params.slug}</p>
				<BlogCard details={latest} latest={true} />
			</div>
			<div class=" grid grid-cols-1 md:grid-cols-2 gap-5">
				{#each currentPageData as post (post.slug)}
					<BlogCard details={post} />
				{/each}
			</div>

			{#if showPagination}
				<div class="flex justify-between w-full">
					<button
						on:click={prev}
						disabled={mutePrev}
						class="bg-orange-200 dark:bg-stone-900 border border-b-2 border-orang dark:border-dark w-32 py-2 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-300"
						><Fa icon={faAngleLeft} /> prev</button
					>
					<button
						on:click={next}
						disabled={muteNext}
						class="bg-orange-200 dark:bg-stone-900 border border-b-2 border-orang dark:border-dark w-32 py-2 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-300"
						><span class="">next</span> &nbsp; <Fa icon={faAngleRight} /></button
					>
				</div>
			{/if}
		</div>

		<div class="flex flex-col gap-6 px-6">
			<h4 class="text-sm">
				Visual powered blog - Get the best learning experience with interactive elements to showcase
				concepts 🫶.
			</h4>

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
