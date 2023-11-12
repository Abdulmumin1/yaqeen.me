<script>
	import { faAngleRight, faClock, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import BlogSPost from './blogSPost.svelte';
	import { faDev, faHashnode, faMedium, faYoutube } from '@fortawesome/free-brands-svg-icons';
	import { latestPostDetail, others } from '$lib/utils/latestbog.js';
	import { mylinks } from '$lib/utils/randomstore.js';
	import { onMount } from 'svelte';

	$: posts = [];
	onMount(async () => {
		const response = await fetch('blog/api/postlg');
		posts = await response.json();

		// console.log(post);
	});
</script>

<div>
	<div class="flex gap-4 h-full flex-col lg:flex-row w-full">
		<div class="w-full h-full">
			<h2 class="lg:text-4xl text-3xl font-visby_bold font-bold mt-6 mb-4">Latest Post</h2>

			<div
				class="w-full gap-4 flex flex-col border rounded-xl border-b-2 h-full p-5 bg-orange-100 dark:bg-stone-900 dark:text-orange-200 border-orang dark:border-dark"
			>
				<a
					href={`/blog/${posts[0]?.slug}`}
					class="text-[4rem] lg:text-[4rem] font-visby_bold font-bold"
					><h1 class="leading-none">
						{posts[0]?.title}
					</h1></a
				>
				<p class="text-stone-950 dark:text-orange-100">
					{posts[0]?.description}
				</p>
				<div
					class="flex items-center w-fit space-x-2 p-2 rounded-xl border border-orang hover:shadow-xl dark:border-dark"
				>
					<a href={$latestPostDetail.link} class="hover_link_fill">Read More </a>
					<Fa icon={faAngleRight} />
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
				<BlogSPost title={post.title} link={`/blog/${post.slug}`} />
			{/each}
			<!-- <BlogSPost title={' Git For Beginners: A Complete Guide.'} /> -->

			<p class="border-l-4 border-orang dark:border-dark pl-1 b rounded-l">
				My writings are available in all your favorite plaforms
			</p>
			<div
				class="space-x-2 p-3 my-3 items-center border border-orang dark:border-dark rounded-xl justify-between flex"
			>
				<p class="text-xl lg:text-2xl font-visby_mid self-center">Read anywhere</p>
				<div class="flex space-x-2 text-xl lg:text-3xl items-center">
					<a href="/blog"> <Fa icon={faEllipsisH} /> </a>
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
	</div>
</div>
