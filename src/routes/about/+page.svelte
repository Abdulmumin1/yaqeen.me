<script>
	import me from '$lib/images/abdul.jpg';

	import { fly, scale, slide } from 'svelte/transition';
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
		<div class="rounded-full p-2">
			<img src={me} alt="Abdulmumin Yaqeen" width="150px" class="rounded-full" />
		</div>
		<h1 class="text-3xl font-visby_mid font-bold w-fit pb-4 text-orang dark:text-dark">About me</h1>
		<div class="text-md lg:text-lg flex flex-col space-y-2">
			<p>
				I'm Abdulmumin Yaqeen Abdulkarim, i have been hitting the keyboards for the past 3 years.
			</p>
			<p>
				I mostly write lots of python and javascript code, and worked in various field spanning web,
				mobile and cloud computing.
			</p>
			<p>
				I have a deep fascination for computer science theory. Enjoys exploring new tools and
				technologies and I actively seek opportunities to expand my knowledge and skill set.
			</p>
			<p>
				I'm commited to both learning and writing and I actively share my learnings and knowledge
				through my blog with the rest of the world.
			</p>
			<h3 class="text-2xl font-bold text-orang dark:text-dark">Things I Enjoy</h3>
			<ul
				class="space-y-3 py-3 divide-orang dark:divide-dark list-inside rounded-xl bg-orange-100 dark:bg-stone-800 divide-y flex justify-center flex-col list-none"
			>
				<li class="px-3">Writing</li>
				<li class="px-3">Drawing</li>
				<li class="px-3">
					& Of course, <span class="font-bold">Space!!</span> It such a beauty.
					<p class="pl-3 text-dark rounded-lg dark:text-black bg-orange-200 dark:bg-dark">
						I mean the constellation, Moon, sometimes I just wished I had pursued a field in
						astrology because it has always fascinated me. The celestial bodies, their complexity,
						and their influence on human behavior have always intrigued me. The Moon, in particular,
						with its ever-changing phases and mysterious presence in the night sky, holds a special
						allure.
					</p>
				</li>
			</ul>
			<h3 class="text-2xl font-bold text-orang dark:text-dark">Frameworks I Use</h3>

			<ul class="grid grid-cols-2 gap-4">
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
					<span class="text-lg font-bold">Tailwind</span>
				</li>
				<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
					<span class="text-lg font-bold">AWS</span>
				</li>
				<li class="bg-orange-200 dark:bg-stone-800 p-4 rounded-md">
					<span class="text-lg font-bold">Bash & Linux</span>
				</li>
			</ul>
		</div>
	</div>
</div>
