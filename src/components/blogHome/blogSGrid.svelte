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

<div class=" h-full w-full">
	<div class="grid grid-cols-2 gap-4 h-full flex-col md:flex-row w-full">
		{#await loadPost()}
			<p>loading</p>
		{:then posts}
			<div class="w-full h-full flex flex-col">
				<h2 class="lg:text-4xl text-3xl font-visby_bold font-bold mt-6 mb-4">Latest Post</h2>

				<div
					class="w-full gap-4 flex justify-between flex-col border rounded-xl border-b-2 h-full p-5 bg-orange-100 dark:bg-stone-900 dark:text-orange-200 border-orang dark:border-dark"
				>
					<div class="flex items-center gap-2">
						<Fa icon={faCalendar} />
						{formatDate(posts[0]?.date)}
					</div>
					<div class="flex flex-col">
						<a
							href={`/blog/${posts[0]?.slug}`}
							class="text-[2rem] lg:text-[4rem] font-visby_bold font-bold"
							><h1 class="leading-none text-orang dark:text-dark">
								{posts[0]?.title}
							</h1></a
						>
						<p class="text-stone-950 dark:text-orange-100">
							{posts[0]?.description}
						</p>
						<div
							class="flex items-center w-fit space-x-2 p-2 rounded-xl border border-orang dark:border-dark hover_link_fill"
						>
							<a href={`blog/${posts[0]?.slug}`} class="">Read More </a>
							<Fa icon={faAngleRight} />
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-4">
				<p
					class="mt-6 mb-4 visby_bold text-2xl lg:text-4xl border-b-2 w-fit border-orang dark:border-dark"
				>
					Recent
				</p>
				{#each posts.slice(1, 4) as post}
					<BlogSPost title={post.title} link={`/blog/${post.slug}`} date={post.date} />
				{/each}
				<!-- <BlogSPost title={' Git For Beginners: A Complete Guide.'} /> -->

				<div
					class="space-x-2 p-3 my-3 items-center border border-orang dark:border-dark rounded-xl justify-between flex"
				>
					<p class="text-xl lg:text-2xl font-visby_mid self-center">Writings Available @</p>
					<div class="flex space-x-2 text-xl items-center">
						<a href="/blog"> <Fa icon={faArrowDown} /> </a>
						<a href={$mylinks.hashnode} target="_blank">
							<Fa icon={faHashnode} />
						</a>
						<a href={$mylinks.devto} target="_blank">
							<Fa icon={faDev} />
						</a>
						<a href={$mylinks.medium} target="_blank">
							<Fa icon={faMedium} />
						</a>
					</div>

					<!-- <p class="text-2xl font-visby_mid">Subscribe to my Newsletter</p>
				<input
					placeholder="name@example.com"
					class="p-2 bg-inherit border border-orang dark:border-dark rounded"
				/>
				<button class=" hover_link_fill">Subscribe</button> -->
				</div>
			</div>
		{/await}
	</div>
</div>
