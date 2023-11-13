<script>
	import BlogSection from '../components/blogHome/blogSection.svelte';
	import Hero from '../components/home/hero.svelte';
	import ProSection from '../components/projects/proSection.svelte';
	import { fly, scale, slide, draw } from 'svelte/transition';
	import me from '$lib/images/me.jpg';
</script>

<svelte:head>
	<!-- HTML Meta Tags -->
	<title>Abdulmumin Yaqeen</title>
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

<div class="snap-proximity md:p-4 snap-y flex flex-col items-center justify-center">
	<div class="flex flex-col max-w-[1000px]">
		<Hero />
		<ProSection />
		<BlogSection />
	</div>
</div>
