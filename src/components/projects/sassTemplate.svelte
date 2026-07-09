<script>
	import { faLongArrowRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let { details } = $props();
</script>

<div class="relative py-4 group">
	<!-- Year in gutter -->
	<div
		class="md:absolute md:-left-32 md:w-24 text-xs md:text-sm font-serif text-text-muted/60 md:text-right italic mb-2 md:mb-0 year-gutter"
	>
		{details.year || ''}
	</div>

	<div class="flex flex-col gap-2 hover:cursor-pointer">
		<div class="flex items-baseline gap-3 flex-wrap">
			<h3
				class="text-lg md:text-2xl flex gap-2 items-center font-serif text-text-main group-hover:text-accent transition-colors"
			>
				<span class="relative inline-flex italic text-accent opacity-60 project-icon-wrap"
					><img
						src={details.icon}
						class="h-7 md:h-9 rounded-xl project-icon-glow"
						alt=""
						aria-hidden="true"
					/>
					<img src={details.icon} class="h-7 md:h-9 rounded-xl project-icon" alt="" /></span
				>
				<a href="https://{details.links.page}"> {details.name}</a>
			</h3>
		</div>

		<div class="flex gap-1.5">
			<!-- {#if details.links?.page}
				<a
					href="https://{details.links.page}"
					target="_blank"
					class="text- text-accent/60 hover:text-accent transition-colors lowercase after:absolute after:inset-0 z-10"
				>
					{details.links.page}
				</a>
			{/if} -->

			<p class="text-sm md:text-base font-visby text-text-muted leading-relaxed max-w-xl">
				{details.description}
			</p>
		</div>
	</div>
</div>

<style>
	.project-icon-wrap {
		isolation: isolate;
	}

	.project-icon {
		filter: grayscale(100%) brightness(140%) contrast(85%);
		mix-blend-mode: screen;
		opacity: 0.72;
		transition:
			opacity 180ms ease,
			filter 180ms ease,
			transform 180ms ease;
		position: relative;
		z-index: 1;
	}

	.project-icon-glow {
		position: absolute;
		inset: 0;
		opacity: 0;
		filter: blur(12px) saturate(180%) brightness(120%);
		transition:
			opacity 180ms ease,
			transform 180ms ease;
		pointer-events: none;
		z-index: 0;
	}

	.group:hover .project-icon {
		filter: grayscale(100%) brightness(155%) contrast(90%);
		opacity: 0.9;
	}

	.group:hover .project-icon-glow {
		opacity: 0;
	}

	@media (min-width: 768px) {
		.year-gutter {
			top: 26px;
		}
	}
</style>
