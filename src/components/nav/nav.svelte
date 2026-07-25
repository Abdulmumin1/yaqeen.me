<script>
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	let isHomeActive = $derived(page.url.pathname === '/');
	let isThoughtsActive = $derived(
		page.url.pathname.startsWith('/blog') ||
			page.url.pathname.startsWith('/category') ||
			page.url.pathname.startsWith('/about')
	);
	let isWorkActive = $derived(
		page.url.pathname.startsWith('/projects') ||
			['/drop', '/braintime', '/css-faster'].includes(page.url.pathname)
	);

	const navItems = $derived([
		{ name: 'Home', href: '/', active: isHomeActive },
		{ name: 'Thoughts', href: '/blog', active: isThoughtsActive },
		{ name: 'Work', href: '/projects', active: isWorkActive },
		{ name: 'RSS', href: '/rss.xml', active: false }
	]);
</script>

<nav
	class="font-serif select-none flex items-center mx-auto px-5 md:px-1 max-w-[40rem] justify-between py-4 text-sm sm:text-base"
>
	{#each navItems as item (item.name)}
		<div class="flex items-center gap-1 relative group">
			<span class="w-4 flex items-center justify-center shrink-0">
				{#if item.active}
					<span class="w-1.5 h-1.5 bg-accent inline-block rounded-[1px]" aria-hidden="true"></span>
				{/if}
			</span>
			<a
				href={resolve(item.href)}
				class="transition-colors whitespace-nowrap {item.active
					? 'text-text-main font-comic font-bold'
					: 'text-text-muted hover:text-text-main font-medium'}"
			>
				{item.name}
			</a>
		</div>
	{/each}
</nav>
