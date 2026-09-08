<script>
	import { project_data, sass_projects } from '$lib/utils/projectStore.js';

	function hrefFor(project) {
		const href = project.links?.page || project.links?.study;
		if (!href) return null;
		return href.startsWith('http') ? href : `https://${href}`;
	}

	let selectedProjects = $derived($project_data.slice(0, 7));
</script>

<div class="project-sections" id="projects">
	<section aria-labelledby="products-heading">
		<h2 id="products-heading">Products</h2>
		<div class="project-rows">
			{#each $sass_projects as project (project.name)}
				<p class="project-line">
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
					<span class="project-desc"> {project.description}</span>
				</p>
			{/each}
		</div>
	</section>

	<section aria-labelledby="work-heading">
		<h2 id="work-heading">Selected work</h2>
		<div class="project-rows">
			{#each selectedProjects as project (project.name)}
				<p class="project-line">
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
					<span class="project-desc"> {project.description}</span>
				</p>
			{/each}
			<a class="more-link" href="https://github.com/Abdulmumin1" target="_blank" rel="noopener noreferrer"
			>
				More on GitHub →
			</a>
		</div>
	</section>
</div>

<style>
	.project-sections {
		display: grid;
		gap: 4rem;
		width: 100%;
		font-family: var(--site-font-body);
	}

	h2 {
		margin: 0 0 1.5rem;
		color: var(--color-text-main);
		font-family: var(--site-font-display);
		font-size: clamp(1.65rem, 3vw, 2.15rem);
		font-weight: 400;
		line-height: 1.2;
	}

	.project-rows {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}

	.project-line {
		margin: 0;
		color: var(--color-text-muted);
		font-size: clamp(1.05rem, 2vw, 1.25rem);
		line-height: 1.6;
		text-wrap: pretty;
	}

	.project-link,
	.project-lead {
		color: var(--color-text-main);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 0.2em;
		text-decoration-color: color-mix(in srgb, var(--color-accent) 35%, transparent);
		transition: color 160ms ease, text-decoration-color 160ms ease;
	}

	.project-link:hover {
		color: var(--color-accent);
		text-decoration-color: var(--color-accent);
	}

	.project-desc {
		color: var(--color-text-muted);
	}

	.more-link {
		display: inline-block;
		margin-top: 0.25rem;
		color: color-mix(in srgb, var(--color-text-muted) 80%, transparent);
		font-family: var(--site-font-utility);
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-decoration: none;
		text-transform: lowercase;
		transition: color 160ms ease;
	}

	.more-link:hover {
		color: var(--color-accent);
	}

	@media (max-width: 600px) {
		h2 {
			margin-bottom: 1rem;
			font-size: clamp(1.2rem, 2.5vw, 1.6rem);
		}

		.project-rows {
			gap: 0.95rem;
		}

		.project-line {
			font-size: clamp(0.95rem, 1.8vw, 1.05rem);
			line-height: 1.55;
		}
	}
</style>
