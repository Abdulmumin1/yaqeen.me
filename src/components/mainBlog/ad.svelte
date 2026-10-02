<script>
	const products = [
		{ name: 'Owostack', desc: 'Billing engine for the AI products.', link: 'https://owostack.com' },
		{ name: 'Thirdpen', desc: 'Interactive learning with AI.', link: 'https://thirdpen.app' },
		{
			name: 'Littlestats',
			desc: 'Analytics for solo creators.',
			link: 'https://littlestats.click'
		}
	];

	function track(name) {
		if (typeof window !== 'undefined' && window.trackEvent) {
			window.trackEvent(`${name} Ad`, { page: document.title });
		}
	}
</script>

<!-- The same kind of list as Products on the home page. -->
<section aria-labelledby="built-by-me">
	<h2 id="built-by-me" class="section-heading">Built by me</h2>
	<div class="row-list">
		{#each products as product (product.name)}
			<p class="type-list text-text-muted">
				<a
					href={product.link}
					target="_blank"
					rel="noopener noreferrer"
					onclick={() => track(product.name)}
					class="link font-semibold">{product.name}</a
				>
				{product.desc}
			</p>
		{/each}
	</div>
</section>
