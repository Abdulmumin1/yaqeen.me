<script>
	import { project_data, sass_projects } from '$lib/utils/projectStore.js';
	import HoverPeek from '$components/general/hoverPeek.svelte';

	function hrefFor(project) {
		const href = project.links?.page || project.links?.study;
		if (!href) return null;
		return href.startsWith('http') ? href : `https://${href}`;
	}

	let selectedProjects = $derived($project_data.slice(0, 7));
</script>

<HoverPeek subjects={[...$sass_projects, ...selectedProjects]}>
<div class="project-sections" id="projects">
	<section aria-labelledby="products-heading">
		<h2 id="products-heading" class="section-heading">Products</h2>
		<div class="row-list" data-peek-group>
			{#each $sass_projects as project (project.name)}
				<p class="project-line type-list" data-peek={project.name}>
					{#if hrefFor(project)}
						<a
							href={hrefFor(project)}
							target="_blank"
							rel="noopener noreferrer"
							class="project-link"
						>
							{project.name}
						</a>
					{:else}
						<strong class="project-lead">{project.name}</strong>
					{/if}
					<span> {project.description}</span>
				</p>
			{/each}
		</div>
	</section>

	<section aria-labelledby="work-heading">
		<h2 id="work-heading" class="section-heading">Selected work</h2>
		<div class="row-list" data-peek-group>
			{#each selectedProjects as project (project.name)}
				<p class="project-line type-list" data-peek={project.name}>
					{#if hrefFor(project)}
						<a
							href={hrefFor(project)}
							target="_blank"
							rel="noopener noreferrer"
							class="project-link"
						>
							{project.name}
						</a>
					{:else}
						<strong class="project-lead">{project.name}</strong>
					{/if}
					<span> {project.description}</span>
				</p>
			{/each}
			<a
				class="more-link tiny-link"
				href="https://github.com/Abdulmumin1"
				target="_blank"
				rel="noopener noreferrer"
			>
				more on github →
			</a>
		</div>
	</section>
</div>
</HoverPeek>

<style>
	.project-sections {
		display: grid;
		gap: var(--gap-section);
		width: 100%;
	}

	.project-line {
		margin: 0;
		color: var(--color-text-muted);
		text-wrap: pretty;
	}

	.project-link,
	.project-lead {
		color: var(--color-text-main);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 0.2em;
		text-decoration-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
		transition: text-decoration-color 160ms ease;
	}

	.project-link:hover {
		text-decoration-color: var(--color-accent);
	}

	/* The last row of its list, but only as wide as its words. */
	.more-link {
		align-self: flex-start;
	}
</style>
