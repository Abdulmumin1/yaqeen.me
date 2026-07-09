<script>
	import '../app.css';
	import Nav from '../components/nav/nav.svelte';
	import Footer from '../components/home/footer.svelte';
	import { page } from '$app/state';
	import { KDialog, setKbarState } from 'kbar-svelte-mini';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { siteOrigin, siteName } from '$lib/js/config.js';
	import { darkMode } from '$lib/utils/darkmode.js';
	import { setModalContext, setCurrentProjectInModal } from '$lib/utils/projectStore';

	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();

	setModalContext();
	setCurrentProjectInModal();
	setKbarState();

	let isBlog = $derived(
		page.url.pathname.startsWith('/blog') || page.url.pathname.startsWith('/category')
	);

	async function fetchPosts() {
		const response = await fetch('/blog/api/posts');
		const posts = await response.json();
		return posts;
	}

	function changeTheme(value) {
		darkMode.set(value);
		localStorage.theme = value ? 'dark' : 'light';
		if (value) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
	let posts = $state([]);

	let actions = $derived([
		{
			title: 'Home',
			callback: () => {
				goto(resolve('/'));
			}
		},
		{
			title: 'About',
			callback: () => {
				goto(resolve('/about'));
			}
		},
		{
			title: 'Projects',
			callback: () => {
				goto(resolve('/projects'));
			}
		},
		{
			title: 'Blog',
			callback: () => {
				goto(resolve('/blog'));
			}
		},
		{
			title: 'Change Theme',
			nested: [
				{
					title: 'Light',
					callback: () => {
						changeTheme(false);
					}
				},
				{
					title: 'Dark',
					callback: () => {
						changeTheme(true);
					}
				}
			]
		},
		{
			title: 'Search Blog',
			nested: posts
		}
	]);

	let loaded = $state(false);

	onMount(async () => {
		let isDarkMode = document.documentElement.classList.contains('dark');
		darkMode.set(isDarkMode);

		let result = await fetchPosts();
		result.allPosts.forEach((element) => {
			posts = [
				...posts,
				{
					title: element.title,
					subtitle: `${(element.description || '').slice(0, 100)}...`,
					callback: () => {
						if (element.isExternal) {
							window.open(element.href, '_blank', 'noopener,noreferrer');
							return;
						}
						goto(resolve('/blog/[slug]', { slug: element.slug }));
					}
				}
			];
		});
		loaded = true;
	});
</script>

<svelte:head>
	<link
		rel="alternate"
		type="application/rss+xml"
		title={`${siteName} RSS Feed`}
		href={`${siteOrigin}/rss.xml`}
	/>
</svelte:head>

<div class="fixed inset-0 z-[1000] pointer-events-none bg-noise opacity-[0.03]"></div>

<div
	class="w-full overflow-x-hidden bg-surface text-text-main relative transition-colors duration-500 min-h-screen"
>
	<div class="max-w-5xl mx-auto px-6 py-12 md:py-24 flex flex-col md:flex-row gap-12 md:gap-16">
		<aside class="md:w-40 shrink-0 md:sticky md:top-24 h-fit">
			<Nav {isBlog} />
		</aside>
		<div class="flex-1 min-w-0">
			<main class="relative z-10">
				{@render children?.()}
			</main>
			{#if !['/garden'].includes(page.url.pathname)}
				<Footer />
			{/if}
		</div>
	</div>
</div>

{#if loaded}
	<KDialog
		{actions}
		--bg={!$darkMode ? '#fcfaf7' : '#1c1917'}
		--kbar-primary="#f9411f"
		--kbar-gray="#1c1917"
		--shadow="0px .2px .2px #f9411f"
	/>
{/if}
