<script>
	const products = [
		{
			name: 'Owostack',
			desc: 'Billing engine for the AI products.',
			link: 'https://owostack.com',
			symbol: '✶',
			color: 'text-accent'
		},
		{
			name: 'Thirdpen',
			desc: 'Interactive learning with AI.',
			link: 'https://thirdpen.app',
			symbol: '✸',
			color: 'text-text-muted/70'
		},
		{
			name: 'Littlestats',
			desc: 'Analytics for solo creators.',
			link: 'https://littlestats.click',
			symbol: '✹',
			color: 'text-text-muted/70'
		}
	];

	function track(name) {
		if (typeof window !== 'undefined' && window.trackEvent) {
			window.trackEvent(`${name} Ad`, { page: document.title });
		}
	}
</script>

<div class=" border-t border-border/10 relative overflow-hidden">
	<!-- Background Ornament -->

	<div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-start">
		<div class="">
			<h3 class="text-2xl md:text-4xl font-serif text-text-main leading-none italic mb-4">Built by me.</h3>
		</div>

		<div class="divide-y divide-border/10">
			{#each products as product (product.name)}
				<a
					href={product.link}
					target="_blank"
					rel="noopener noreferrer"
					onclick={() => track(product.name)}
					class="group block py-8 first:pt-0 last:pb-0"
				>
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1">
							<div class="flex items-center gap-3 mb-2">
								<span class="text-lg {product.color}">{product.symbol}</span>
								<h4
									class="text-lg md:text-2xl font-serif text-text-main group-hover:text-accent transition-colors duration-300 italic"
								>
									{product.name}
								</h4>
							</div>
							<p
								class="text-sm md:text-base font-visby text-text-muted leading-relaxed group-hover:text-text-main transition-colors duration-300 max-w-sm"
							>
								{product.desc}
							</p>
						</div>
						<div
							class="pt-2 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300"
						>
							<span class="text-accent text-xl">→</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
