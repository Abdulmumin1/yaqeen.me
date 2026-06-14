<script>
	let { details } = $props();
</script>

<div class="relative py-6 group">
	<!-- Year in gutter -->
	<div class="md:absolute md:-left-32 md:w-24 text-sm font-serif text-stone-400 md:text-right italic mb-1 md:mb-0">
		{details.year || ''}
	</div>

	<div class="flex flex-col gap-2">
		<div class="flex items-baseline gap-3">
			<h3 class="text-xl font-serif text-stone-900 group-hover:text-accent transition-colors">
				{details.name}
			</h3>
			{#if details.links?.page}
				<a
					href="https://{details.links.page}"
					target="_blank"
					class="text-[10px] font-mono text-accent/60 hover:text-accent transition-colors uppercase tracking-widest"
				>
					{details.links.page}
				</a>
			{/if}
		</div>
		<p class="text-base font-visby text-stone-600 leading-relaxed max-w-lg">
			{details.description}
		</p>
	</div>
</div>
