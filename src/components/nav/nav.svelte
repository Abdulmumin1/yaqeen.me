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
			['/drop', '/braintime', '/css-faster', '/work'].includes(page.url.pathname)
	);

	let isPhotosActive = $derived(page.url.pathname.startsWith('/photos'));

	const navItems = $derived([
		{ name: 'Home', href: '/', active: isHomeActive },
		{ name: 'Thoughts', href: '/blog', active: isThoughtsActive },
		{ name: 'Work', href: '/work', active: isWorkActive },
		{ name: 'Photos', href: '/photos', active: isPhotosActive }
	]);
</script>

<!-- The nav sits in the page column: "Home" starts where the text below it starts,
     and the last item ends where the column ends. -->
<nav class="page-column type-ui flex items-center justify-between py-4 font-medium select-none">
	{#each navItems as item (item.name)}
		<a
			href={resolve(item.href)}
			aria-current={item.active ? 'page' : undefined}
			class="relative whitespace-nowrap transition-colors {item.active
				? 'text-text-main'
				: 'text-text-muted hover:text-text-main'}"
		>
			{#if item.active}
				<!-- The mark for the current page hangs in the margin, like the dates do. -->
				<span
					class="absolute top-1/2 -left-3.5 size-1.5 -translate-y-1/2 rounded-[1px] bg-accent"
					aria-hidden="true"
				></span>
			{/if}
			{item.name}
		</a>
	{/each}
</nav>
