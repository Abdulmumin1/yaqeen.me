<script>
	import { scale, slide } from 'svelte/transition';
	import BlogCard from '../../components/mainBlog/blogCard.svelte';

	export let data;
	// console.log(data.posts);
</script>

<svelte:head>
	<!-- Meta Tags Generated via https://www.opengraph.xyz -->

	<!-- HTML Meta Tags -->
	<title>Blog - Abdulmumin Yaqeen</title>
	<meta name="description" content="A creative, curiosity-driven developer & writer" />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://www.yaqeen.me" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Abdulmumin Yaqeen" />
	<meta property="og:description" content="A creative, curiosity-driven developer & writer" />
	<meta property="og:image" content="https://i.ibb.co/nPW10cf/abdul.png" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="yaqeen.me" />
	<meta property="twitter:url" content="https://www.yaqeen.me" />
	<meta name="twitter:title" content="Abdulmumin Yaqeen" />
	<meta name="twitter:description" content="A creative, curiosity-driven developer & writer" />
	<meta name="twitter:image" content="https://i.ibb.co/nPW10cf/abdul.png" />
</svelte:head>

<section in:scale class="min-h-screen mt-20">
	<article class="<w-full flex justify-center items-center flex-col">
		<div class="max-w-[900px] flex flex-col w-full p-4 md:p-6 gap-4">
			<div class="text-4xl flex flex-col gap-3">
				<p>Latest post</p>
				<BlogCard details={data.posts[0]} latest={true} />
			</div>
			<div class=" grid grid-cols-1 md:grid-cols-2 gap-5">
				{#each data.posts.splice(1, data.posts.length) as post (post.slug)}
					<BlogCard details={post} />
				{/each}
			</div>
		</div>
	</article>
</section>
