<script>
	import me from '$lib/images/abdul.jpg';
	import {
		faGithub,
		faLinkedin,
		faLinkedinIn,
		faTwitter,
		faYoutube
	} from '@fortawesome/free-brands-svg-icons';
	import Fa from 'svelte-fa';
	import { fly, scale, slide } from 'svelte/transition';
	import { mylinks } from '$lib/utils/randomstore.js';
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

<div in:scale out:slide class="min-h-screen flex justify-center p-4">
	<div class="  max-w-[700px] flex flex-col gap-10">
		<div class="flex flex-col md:flex-row pt-10 items-center justify-center gap-10">
			<div class="flex flex-col items-center flex-1">
				<div
					class="rounded-xl border-orang relative tinted-image before:border-2 before:rounded-lg before:border-[#473436] dark:before:bg-dark before:absolute before:top-0 before:w-full before:h-full before:bg-orang"
				>
					<img
						src={me}
						alt="Abdulmumin Yaqeen"
						class="w-[200px] md:w-[500px] -rotate-6 rounded-xl"
					/>
				</div>
				<div class="flex gap-2 p-2 text-xl mt-2">
					<a href={$mylinks.github}>
						<Fa icon={faGithub} />
					</a>
					<a href={$mylinks.linkedin}>
						<Fa icon={faLinkedin} />
					</a>
					<a href={$mylinks.twitter}>
						<Fa icon={faTwitter} />
					</a>
					<a href={$mylinks.youtube}>
						<Fa icon={faYoutube} />
					</a>
				</div>
			</div>
			<div class=" flex flex-col flex-1">
				<div class=" text-base space-y-4 text-balance">
					<h1 class="text-3xl font-visby_mid font-bold w-fit text-orang dark:text-dark">
						About me
					</h1>
					<p>
						I'm Abdulmumin Yaqeen Abdulkarim, Currently a part time <span
							class="border-b border-orang dark:border-dark">Technical Writer</span
						>
						and pursuing my
						<span class="border-b border-orang dark:border-dark">Cyber Security</span> degree.
					</p>
					<p>
						I write lots of Python and Javascript code, and have worked in various field spanning
						web, mobile and cloud computing.
					</p>
					<p>
						I have a deep fascination for computer science and gaining a deeper knowledge on
						computational paradigms.
					</p>
				</div>
				<!-- <p>
					One of the pivotal decisions in my career was embracing the art of writing. I find immense
					joy in articulating complex tech concepts in a way that's accessible to everyone. This has
					undeniably become one of the crowning achievements of my journey, making the fusion of
					technology and writing an integral part of my professional narrative.
				</p> -->

				<!-- <h3 class="text-2xl font-bold text-orang dark:text-dark">Technologies I Use</h3>
	
				<ul class="grid grid-cols-2 gap-4">
					<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
						<span class="text-lg font-bold">Python</span>
					</li>
					<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
						<span class="text-lg font-bold">Javascript</span>
					</li>
					<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
						<span class="text-lg font-bold">Svelte/Sveltekit</span>
					</li>
					<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
						<span class="text-lg font-bold">Flask</span>
					</li>
					<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
						<span class="text-lg font-bold">Django</span>
					</li>
					<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
						<span class="text-lg font-bold">Supabase</span>
					</li>
					<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
						<span class="text-lg font-bold">Prisma</span>
					</li>
					<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
						<span class="text-lg font-bold">MongoDB</span>
					</li>
					<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
						<span class="text-lg font-bold">Tailwind CSS</span>
					</li>
					<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
						<span class="text-lg font-bold">AWS</span>
					</li>
					<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
						<span class="text-lg font-bold">Bash & Linux</span>
					</li>
					<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
						<span class="text-lg font-bold">PyQt</span>
					</li>
				</ul> -->

				<!-- <h3 class="text-2xl font-bold text-orang dark:text-dark">Recent Experience</h3> -->
			</div>
		</div>

		<div class="space-y-5 text-balance">
			<h3 class="text-2xl font-bold text-orang dark:text-dark">Things I Enjoy</h3>
			<ul
				class="space-y-3 py-3 divide-orang dark:divide-dark list-inside rounded-xl bg-orange-100 dark:bg-stone-800 divide-y flex justify-center flex-col list-none"
			>
				<li class="px-3 py-2">
					- Writing ✏️
					<p class="pl-3 py-2 my-2 border-l-4 border-orang dark:border-dark">
						I love writing, and have been sharing my thoughts on this platform and others(<a
							target="_blank"
							class="text-orang dark:text-dark"
							href="https://dev.to/abdulmuminyqn">dev.to</a
						>,
						<a target="_blank" class="text-orang dark:text-dark" href="https://avdurr.hashnode.com"
							>hashnode.com</a
						>) for quite a while.
					</p>
				</li>
				<li class="px-3 py-2">
					- Drawing 🎨
					<p class="pl-3 py-2 my-2 border-l-4 border-orang dark:border-dark">
						Not a pro, mostly just doodling away.
					</p>
				</li>
				<li class="px-3 py-2">
					- Photography 📸
					<!-- <p class="pl-3 py-2 my-2 border-l-4 border-orang dark:border-dark">My plan B.</p> -->
				</li>
				<li class="px-3 py-2">Alone time 🔇</li>
				<li class="px-3 py-3">
					- & Of course, <span class="font-bold">Nature!! 🌌</span>
					<p class="pl-3 py-2 my-2 border-l-4 border-orang dark:border-dark">
						I love universe and the creator, nature and all of It beauty. The state of constant
						"awe", is just exciting to me!!
					</p>
				</li>
			</ul>
		</div>
	</div>
</div>

<style>
	.tinted-image {
		position: relative;
		display: inline-block;
	}

	.tinted-image img {
		display: block;
		max-width: 100%;
		height: auto;
		z-index: 2; /* Ensure the image is above the tint layer */
	}
</style>
