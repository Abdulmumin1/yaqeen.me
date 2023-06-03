<script>
	import latestPostImage from '$lib/images/latest-blog.png';
	import { faAngleRight, faClock } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import BlogSPost from './blogSPost.svelte';
	import { faDev, faHashnode, faMedium } from '@fortawesome/free-brands-svg-icons';
</script>

<div>
	<div class="flex lg:space-x-4 h-full flex-col lg:flex-row">
		<div class="lg:w-3/5 mb-3">
			<img src={latestPostImage} alt="" class="border-[1.8px] border-black rounded-md" />
			<p class="text-2xl lg:text-4xl font-visby_bold font-bold">Python tips and tricks</p>
			<p class="text-stone-400">
				When we talk python, we don't normally include building mobile apps, this is because these
				python frameworks are not fully optimized to build a production re.....
			</p>
			<div
				class="flex items-center w-fit space-x-2 p-2 rounded-xl border border-black hover:shadow-xl dark:border-[#333]"
			>
				<a href="#" class="hover_link_fill">Read More </a>
				<Fa icon={faAngleRight} />
			</div>
		</div>
		<div class="flex flex-col">
			<BlogSPost title={' Getting started with CI/CD with Github Actions'} />
			<BlogSPost title={' Git For Beginners: A Complete Guide.'} />
		</div>
	</div>
	<div
		class="space-y-2 border-2 border-black dark:border-[#333] p-3 my-3 rounded items-center justify-center flex flex-col"
	>
		<p class="text-3xl font-visby_bold font-bold">Find my writings</p>
		<div class="flex space-x-2">
			<Fa icon={faHashnode} />
			<Fa icon={faDev} />
			<Fa icon={faMedium} />
		</div>

		<p class="text-2xl font-visby_bold font-bold">Subscribe to my Newsletter</p>
		<input
			placeholder="name@example.com"
			class="p-2 bg-inherit border border-black dark:border-[#333] rounded w-full"
		/>
		<button class=" hover_link_fill">Subscribe</button>
	</div>
</div>
