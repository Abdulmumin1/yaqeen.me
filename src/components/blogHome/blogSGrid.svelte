<script>
	import { faAngleRight, faClock, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import BlogSPost from './blogSPost.svelte';
	import { faDev, faHashnode, faMedium, faYoutube } from '@fortawesome/free-brands-svg-icons';
	import { latestPostDetail, others } from '$lib/utils/latestbog.js';
</script>

<div>
	<div class="flex lg:space-x-4 h-full flex-col lg:flex-row">
		<div class="lg:w-3/5 mb-3 space-y-1">
			<img
				src={$latestPostDetail.imageLink}
				alt=""
				class="border-2 border-orang dark:border-dark rounded-md"
			/>
			<a href={$latestPostDetail.link} class="text-2xl lg:text-4xl font-visby_bold font-bold"
				>{$latestPostDetail.title}</a
			>
			<p class="text-stone-950 dark:text-stone-100">
				{$latestPostDetail.description}
			</p>
			<div
				class="flex items-center w-fit space-x-2 p-2 rounded-xl border border-orang hover:shadow-xl dark:border-dark"
			>
				<a href={$latestPostDetail.link} class="hover_link_fill">Read More </a>
				<Fa icon={faAngleRight} />
			</div>
		</div>
		<div class="flex flex-col space-y-3">
			<p class="visby_bold text-2xl lg:text-4xl border-b-2 w-fit border-orang dark:border-dark">
				Recent
			</p>
			{#each $others as post (post.link)}
				<BlogSPost title={post.title} link={post.link} />
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
					<a href="https://abdulmumin.com" target="_blank">
						<Fa icon={faHashnode} />
					</a>
					<a href="https://dev.to/@abdulmuminyqn" target="_blank">
						<Fa icon={faDev} />
					</a>
					<a href="https://medium.com/@abdulmuminyqn" target="_blank">
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
