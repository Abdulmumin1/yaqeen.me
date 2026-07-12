<script>
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import {
		faArrowDownLong,
		faArrowRightLong,
		faExternalLink
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let { details } = $props();
</script>

<div class="relative py-5 group">
	<!-- Year in gutter -->
	<div
		class="md:absolute md:-left-32 md:w-24 text-xs md:text-sm font-serif text-text-muted/60 md:text-right italic mb-2 md:mb-0 year-gutter"
	>
		{details.year || ''}
	</div>

	<div class="flex flex-col gap-2">
		<div class="flex items-baseline gap-3 flex-wrap">
			<h3
				class="text-lg md:text-2xl font-serif text-text-main group-hover:text-accent transition-colors"
			>
				{details.name}
			</h3>
			<div
				class="flex gap-3 md:gap-4 text-base md:text-lg font-mono text-accent/60 lowercase tracking-widest"
			>
				{#if details.links?.page}
					<a
						href="https://{details.links.page}"
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Visit ${details.name}`}
						class="hover:text-accent transition-colors after:absolute after:inset-0 z-10"
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
						class="hover:text-accent transition-colors {!details.links?.page
							? 'after:absolute after:inset-0 z-10'
							: 'relative z-20'}"
					>
						<Fa icon={faGithub} />
					</a>
				{/if}
			</div>
		</div>
		<p class="text-sm md:text-base font-visby text-text-muted leading-relaxed max-w-xl">
			{details.description}
		</p>
	</div>
</div>

<style>
	@media (min-width: 768px) {
		.year-gutter {
			top: 28.5px;
		}
	}
</style>
