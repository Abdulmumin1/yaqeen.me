<script>
	import latestPostImage from '$lib/images/latest-blog.png';
	import { faAngleRight, faClock, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import BlogSPost from './blogSPost.svelte';
	import { faDev, faHashnode, faMedium, faYoutube } from '@fortawesome/free-brands-svg-icons';
</script>

<div>
	<div class="flex lg:space-x-4 h-full flex-col lg:flex-row">
		<div class="lg:w-3/5 mb-3 space-y-1">
			<img src={latestPostImage} alt="" class="border-[1.8px] border-black rounded-md" />
			<p class="text-2xl lg:text-4xl font-visby_bold font-bold">Python tips and tricks</p>
			<p class="text-stone-400">
				This appears in almost any programming article on "best practices", so I had to make it my
				number one point. Writing global state variables comes with a lot of problems, like code
				readability issues, maintenance and namespace conflicts. Instead of global variables, you
				can use function parameters or...
			</p>
			<div
				class="flex items-center w-fit space-x-2 p-2 rounded-xl border border-black hover:shadow-xl dark:border-[#333]"
			>
				<a href="#" class="hover_link_fill">Read More </a>
				<Fa icon={faAngleRight} />
			</div>
		</div>
		<div class="flex flex-col space-y-3">
			<p
				class="visby_bold text-2xl lg:text-4xl border-b-2 w-fit border-black dark:border-b-orange-100"
			>
				Recent
			</p>
			<BlogSPost title={' Getting started with CI/CD with Github Actions'} />
			<BlogSPost title={' Git For Beginners: A Complete Guide.'} />

			<p class="border-l-2 border-current pl-1">
				My writings are available in all your favorite plaforms
			</p>
			<div
				class="space-x-2 p-3 my-3 items-center border border-black dark:border-[#333] rounded-xl justify-between flex"
			>
				<p class="text-xl lg:text-2xl font-visby_mid self-center">Read anywhere</p>
				<div class="flex space-x-2 text-xl lg:text-3xl items-center">
					<a href="/blog" target="_blank"> <Fa icon={faEllipsisH} /> </a>
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
					class="p-2 bg-inherit border border-black dark:border-[#333] rounded"
				/>
				<button class=" hover_link_fill">Subscribe</button> -->
			</div>
		</div>
	</div>
</div>
