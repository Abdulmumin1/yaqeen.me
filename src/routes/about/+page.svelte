<script>
	import me from '$lib/images/abdul.jpg';
	import { faGithub, faLinkedinIn, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
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

<div in:scale out:slide class=" flex justify-center p-4">
	<div class="  max-w-[500px] flex flex-col items-center">
		<div class="rounded-full relative tinted-image">
			<img src={me} alt="Abdulmumin Yaqeen" width="150px" class="rounded-full" />
		</div>
		<div class="flex gap-2 p-2">
			<a href={$mylinks.github}>
				<Fa icon={faGithub} />
			</a>
			<a href={$mylinks.linkedin}>
				<Fa icon={faLinkedinIn} />
			</a>
			<a href={$mylinks.twitter}>
				<Fa icon={faTwitter} />
			</a>
			<a href={$mylinks.youtube}>
				<Fa icon={faYoutube} />
			</a>
		</div>
		<h1 class="text-3xl font-visby_mid font-bold w-fit pb-4 text-orang dark:text-dark">About me</h1>
		<div class="text-md lg:text-lg flex flex-col space-y-2">
			<p>
				I'm Abdulmumin Yaqeen Abdulkarim, I have been on this exhilarating odyssey for the past
				couple of years, constantly hitting the keyboards, and burying my head into the machine.
			</p>
			<p>
				I mostly write lots of python and javascript code, and have worked in various field spanning
				web, mobile and cloud computing.
			</p>
			<p>
				I have a deep fascination for computer science and gaining a deeper knowledge on
				computational paradigms.
			</p>
			<p>
				I think the best decision of my career was to start writing, I super enjoy writing about
				techie stuff in a way that's easy to understand. without a doubt, become one of the crowning
				achievements of my journey.
			</p>
			<h3 class="text-2xl font-bold text-orang dark:text-dark">Things I Enjoy</h3>
			<ul
				class="space-y-3 py-3 divide-orang dark:divide-dark list-inside rounded-xl bg-orange-100 dark:bg-stone-800 divide-y flex justify-center flex-col list-none"
			>
				<li class="px-3 py-2">Writing</li>
				<li class="px-3 py-2">Drawing</li>
				<li class="px-3 py-3">
					& Of course, <span class="font-bold">Space!!</span> It such a beauty.
					<p class="pl-3 py-3 my-2 text-dark rounded-lg dark:text-black bg-orange-200 dark:bg-dark">
						I mean the constellation, Moon, sometimes I just wished I had pursued a field in
						astrology because it has always fascinated me. The celestial bodies, their complexity,
						and their influence on human behavior have always intrigued me. The Moon, in particular,
						with its ever-changing phases and mysterious presence in the night sky, holds a special
						allure.
					</p>
				</li>
			</ul>
			<h3 class="text-2xl font-bold text-orang dark:text-dark">Technologies I Use</h3>

			<ul class="grid grid-cols-2 gap-4">
				<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
					<span class="text-lg font-bold">Python</span>
				</li>
				<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
					<span class="text-lg font-bold">Javascript</span>
				</li>
				<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
					<span class="text-lg font-bold">Svelte</span>
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
					<span class="text-lg font-bold">Tailwind</span>
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
			</ul>

			<h3 class="text-2xl font-bold text-orang dark:text-dark">Recent Experience</h3>
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
