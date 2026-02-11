<script>
	import Fa from 'svelte-fa';
	import { faRightLong } from '@fortawesome/free-solid-svg-icons';

	const products = [
		{
			name: 'Thirdpen',
			desc: 'Personalised interactive learning with AI',
			link: 'https://thirdpen.app',
			label: 'learning'
		},
		{
			name: 'Littlestats',
			desc: 'Fixed-cost analytics for makers',
			link: 'https://littlestats.click',
			label: 'analytics'
		},
		{
			name: 'DevCanvas',
			desc: 'Build websites fast with AI',
			link: 'https://devcanvas.dev/play/try',
			label: 'editor'
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
		<p class="text-[9px] font-mono uppercase tracking-[0.3em] opacity-30">/built-by-me</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
		{#each products as product}
			<div class="flex flex-col gap-2 group">
				<div class="flex items-center justify-between">
					<p class="text-[9px] font-mono opacity-30 uppercase tracking-widest">/{product.label}</p>
				</div>
				<h4 class="text-xs font-bold text-primary">{product.name}</h4>
				<p class="text-[11px] opacity-60 leading-relaxed">{product.desc}</p>
				<a
					href={product.link}
					target="_blank"
					onclick={() => track(product.name)}
					class="text-[10px] font-mono opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all flex items-center gap-1 mt-1"
				>
					visit <Fa icon={faRightLong} />
				</a>
			</div>
		{/each}
	</div>
</div>
