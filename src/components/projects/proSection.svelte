<script>
	import ProjectGrid from './projectGrid.svelte';
	import Fa from 'svelte-fa';
	import { faAngleRight, faFlag } from '@fortawesome/free-solid-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import SassGrid from './sassGrid.svelte';
</script>

<div class=" md:rounded-2xl space-y-5 p-1 py-6 lg:p-6 flex flex-col" id="projects">
	<h2
		class="lg:text-5xl text-4xl text-center font-visby_bold font-bold pb-3 text-orang dark:text-dark"
	>
		Saas Products
	</h2>

	<SassGrid />
	<!-- <ul class="p-2 lg:px-6 flex flex-col gap-2 mb-2">
		<li class="bg-orange-100 p-2 lg:p-4 rounded-lg dark:bg-stone-800">
			<span class="text-base md:text-lg font-bold font-visby_bold"
				><a href="https://kbar-mini.vercel.app" target="_blank">-- kbar-svelte-mini</a>
			</span>
			npm package for svelte to integrate cmd+k/ctrl+k in your website
		</li>
		<li class="bg-orange-100 p-2 lg:p-4 rounded-lg dark:bg-stone-800">
			<span class="text-base md:text-lg font-bold font-visby_bold">-- CSS faster</span> - a vscode snippet
			that allows you to write css faster
		</li>
		<li class="bg-orange-100 p-2 lg:p-4 rounded-lg dark:bg-stone-800">
			<span class="text-base md:text-lg font-bold font-visby_bold"
				><a href="https://github.com/Abdulmumin1/tailwindpie" target="_blank">-- Tailwindpie</a
				></span
			> - A python package that allows you use Tailwind CSS easily in any python project
		</li>
	</ul> -->
</div>

<div class=" md:rounded-2xl space-y-5 p-1 py-6 lg:p-6 flex flex-col" id="projects">
	<h2
		class="lg:text-5xl text-4xl text-center font-visby_bold font-bold pb-3 text-orang dark:text-dark"
	>
		Featured Projects
	</h2>

	<ProjectGrid />
	<!-- <ul class="p-2 lg:px-6 flex flex-col gap-2 mb-2">
		<li class="bg-orange-100 p-2 lg:p-4 rounded-lg dark:bg-stone-800">
			<span class="text-base md:text-lg font-bold font-visby_bold"
				><a href="https://kbar-mini.vercel.app" target="_blank">-- kbar-svelte-mini</a>
			</span>
			npm package for svelte to integrate cmd+k/ctrl+k in your website
		</li>
		<li class="bg-orange-100 p-2 lg:p-4 rounded-lg dark:bg-stone-800">
			<span class="text-base md:text-lg font-bold font-visby_bold">-- CSS faster</span> - a vscode snippet
			that allows you to write css faster
		</li>
		<li class="bg-orange-100 p-2 lg:p-4 rounded-lg dark:bg-stone-800">
			<span class="text-base md:text-lg font-bold font-visby_bold"
				><a href="https://github.com/Abdulmumin1/tailwindpie" target="_blank">-- Tailwindpie</a
				></span
			> - A python package that allows you use Tailwind CSS easily in any python project
		</li>
	</ul> -->
	<div class="text-center flex items-center justify-center space-x-1 w-fit self-center hover_link">
		<a href="https://github.com/Abdulmumin1" class="text-center">Visit Github </a><Fa
			icon={faGithub}
		/>
		<Fa icon={faAngleRight} />
	</div>
</div>
