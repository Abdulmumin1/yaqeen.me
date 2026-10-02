<script>
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let { details } = $props();
</script>

<!-- A project in the full list: its year hangs in the margin, like a post's date. -->
<div class="hang-row group relative">
	<div class="hang-meta">{details.year || ''}</div>

	<div class="flex flex-col gap-1">
		<div class="flex flex-wrap items-baseline gap-3">
			<h3
				class="type-list !font-serif text-text-main underline decoration-transparent underline-offset-[0.2em] transition-colors group-hover:decoration-accent"
			>
				{details.name}
			</h3>
			<div class="type-ui flex gap-3 text-accent md:gap-4">
				{#if details.links?.page}
					<a
						href="https://{details.links.page}"
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Visit ${details.name}`}
						class="z-10 after:absolute after:inset-0"
					>
						<Fa icon={faArrowRightLong} class="-rotate-45" />
					</a>
				{/if}
				{#if details.links?.study}
					<a
						href={details.links.study}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`View ${details.name} source on GitHub`}
						class="text-text-faint transition-colors hover:text-text-main {!details.links?.page
							? 'z-10 after:absolute after:inset-0'
							: 'relative z-20'}"
					>
						<Fa icon={faGithub} />
					</a>
				{/if}
			</div>
		</div>
		<p class="type-ui max-w-xl text-text-muted">
			{details.description}
		</p>
	</div>
</div>
