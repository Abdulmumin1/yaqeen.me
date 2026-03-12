<script>
	import ProjectGrid from './projectGrid.svelte';
	import Fa from 'svelte-fa';
	import { faAngleRight, faFlag } from '@fortawesome/free-solid-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import SassGrid from './sassGrid.svelte';
</script>

<div class="w-full space-y-4 py-8 flex flex-col" id="projects">
	<h2 class="text-[9px] font-mono opacity-30 uppercase tracking-[0.3em]">saas</h2>
	<SassGrid />
</div>

<div class="w-full space-y-4 py-8 flex flex-col" id="projects">
	<h2 class="text-[9px] font-mono opacity-30 uppercase tracking-[0.3em]">featured-projects</h2>
	<ProjectGrid />
	<div
		class="flex items-center space-x-2 text-[9px] font-mono opacity-30 hover:opacity-100 transition-opacity"
	>
		<a href="https://github.com/Abdulmumin1" target="_blank">view github</a>
		<Fa icon={faGithub} />
	</div>
</div>
