<script>
	import { scale, slide } from 'svelte/transition';
	import BlogCard from '../../components/mainBlog/blogCard.svelte';
	import Fa from 'svelte-fa';
	import { faRss } from '@fortawesome/free-solid-svg-icons';
	export let data;
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

<section in:scale class="min-h-screen">
	<div class="w-full flex items-center justify-center space-x-2 pt-6">
		<!-- <input
			value="search - alpha"
			class="bg-inherit border p-2 border-b-2 rounded-xl border-orang dark:border-dark"
		/> -->
		<Fa icon={faRss} />
		<a href="/rss.xml"> RSS</a>
	</div>
	<article class="<w-full flex justify-center items-center">
		<div class="max-w-[900px] w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
			{#each data.posts as post}
				<BlogCard details={post} />
			{/each}
		</div>
	</article>
</section>
