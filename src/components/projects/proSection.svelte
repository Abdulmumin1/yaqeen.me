<script>
	import ProjectGrid from './projectGrid.svelte';
	import Fa from 'svelte-fa';
	import { faAngleRight, faFlag } from '@fortawesome/free-solid-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
</script>

<div
	class="border-t-4 border-dotted border-orang dark:border-dark rounded-sm p-1 py-6 lg:p-6 flex flex-col"
	id="projects"
>
	<h2
		class="lg:text-5xl text-4xl text-center font-visby_bold font-bold pb-3 text-orang dark:text-dark"
	>
		Projects
	</h2>
	<ProjectGrid />
	<div class="text-center flex items-center justify-center space-x-1 w-fit self-center hover_link">
		<a href="https://github.com/Abdulmumin1" class="text-center">Visit Github </a><Fa
			icon={faGithub}
		/>
		<Fa icon={faAngleRight} />
	</div>
</div>
