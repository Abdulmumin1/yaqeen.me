<script>
	import Fa from 'svelte-fa';
	import { faRightLong } from '@fortawesome/free-solid-svg-icons';

	const products = [
		{
			name: 'Owostack',
			desc: 'Usage-based Billing Engine for AI Saas',
			link: 'https://owostack.com',
			label: 'editor'
		},
		{
			name: 'Thirdpen',
			desc: 'Personalised interactive learning with AI',
			link: 'https://thirdpen.app',
			label: 'learning'
		},
		{
			name: 'Littlestats',
			desc: 'Analytics for solo makers',
			link: 'https://littlestats.click',
			label: 'analytics'
		}
	];

	function track(name) {
		if (typeof window !== 'undefined' && window.trackEvent) {
			window.trackEvent(`${name} Ad`, { page: document.title });
		}
	}
</script>

<div class="flex flex-col gap-6 py-8">
	<div class="flex flex-col gap-1">
		<p class="text-[9px] font-mono uppercase tracking-[0.3em] text-text-muted">/built-by-me</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
		{#each products as product}
			<div class="flex flex-col gap-2 group">
				<a
					href={product.link}
					target="_blank"
					onclick={() => track(product.name)}
					class="text-xs font-bold text-primary">{product.name}</a
				>
				<p class="text-[11px] text-text-muted leading-relaxed">{product.desc}</p>
			</div>
		{/each}
	</div>
</div>
