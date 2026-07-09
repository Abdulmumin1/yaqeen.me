<script>
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	let isHomeActive = $derived(page.url.pathname === '/');
	let isThoughtsActive = $derived(
		page.url.pathname.startsWith('/blog') || page.url.pathname.startsWith('/category')
	);
	let isWorkActive = $derived(
		page.url.pathname.startsWith('/projects') ||
			['/drop', '/braintime', '/css-faster'].includes(page.url.pathname)
	);

	const navItems = $derived([
		{ name: 'Home', href: '/', active: isHomeActive },
		{ name: 'Thoughts', href: '/blog', active: isThoughtsActive },
		{ name: 'Work', href: '/projects', active: isWorkActive },
		{ name: 'RSS', href: '/rss.xml', active: false, external: true }
	]);
</script>

<nav class="font-serif select-none flex flex-col gap-3 py-2 text-base">
	{#each navItems as item}
		<div class="flex items-center min-h-[28px] relative group">
			<!-- Marker block -->
			<div class="w-4 flex items-center justify-start shrink-0">
				{#if item.active}
					<span class="w-1.5 h-1.5 bg-accent inline-block rounded-[1px]" aria-hidden="true"></span>
				{/if}
			</div>

			{#if item.external}
				<a
					href={resolve(item.href)}
					target="_blank"
					class="text-text-muted hover:text-text-main transition-colors font-medium"
				>
					{item.name}
				</a>
			{:else}
				<a
					href={resolve(item.href)}
					class="transition-colors font-medium {item.active
						? 'text-text-main font-semibold'
						: 'text-text-muted hover:text-text-main'}"
				>
					{item.name}
				</a>
			{/if}
		</div>
	{/each}
</nav>
