<script>
	let { details } = $props();
</script>

<div class="relative py-8 group">
	<!-- Year in gutter -->
	<div class="md:absolute md:-left-32 md:w-24 text-sm font-serif text-text-muted/60 md:text-right italic mb-2 md:mb-0">
		{details.year || ''}
	</div>

	<div class="flex flex-col gap-2">
		<div class="flex items-baseline gap-3 flex-wrap">
			<h3 class="text-2xl font-serif text-text-main group-hover:text-accent transition-colors">
				{details.name}
			</h3>
			<div class="flex gap-4 text-[10px] font-mono text-accent/60 uppercase tracking-widest">
				{#if details.links?.page}
					<a href="https://{details.links.page}" target="_blank" class="hover:text-accent transition-colors after:absolute after:inset-0 z-10">
						visit
					</a>
				{/if}
				{#if details.links?.study}
					<a href={details.links.study} target="_blank" class="hover:text-accent transition-colors {!details.links?.page ? 'after:absolute after:inset-0 z-10' : 'relative z-20'}">
						github
					</a>
				{/if}
			</div>
		</div>
		<p class="text-base font-visby text-text-muted leading-relaxed max-w-xl">
			{details.description}
		</p>
	</div>
</div>
