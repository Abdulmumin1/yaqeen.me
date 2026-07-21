<script>
	import ProjectGrid from './projectGrid.svelte';
	import SassGrid from './sassGrid.svelte';
</script>

<div class="w-full space-y-16 flex flex-col" id="projects">
	<div class="space-y-6">
		<h2 class="text-xl md:text-3xl font-serif text-text-main">Products</h2>
		<SassGrid />
	</div>

	<div class="space-y-6">
		<h2 class="text-xl md:text-3xl font-serif text-text-main">Open Source</h2>
		<ProjectGrid />

		<div class="pt-4">
			<a
				href="https://github.com/Abdulmumin1"
				target="_blank"
				rel="noopener noreferrer"
				class="text-xs font-mono text-accent/60 hover:text-accent transition-colors lowercase tracking-[0.2em]"
			>
				view more on github →
			</a>
		</div>
	</div>
</div>
