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
	import PullCordSwitch from '$components/general/PullCordSwitch.svelte';
	import DoodleLayer from '$components/general/doodleLayer.svelte';
	import { doodle } from '$components/general/doodle.svelte.js';

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

	// Keep the browser chrome (mobile address bar / status bar) and native
	// controls in step with the page as the theme changes.
	$effect(() => {
		const isDark = $darkMode;
		document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
		const meta = document.querySelector('meta[name="theme-color"]');
		if (!meta) return;
		const surface = getComputedStyle(document.body).backgroundColor;
		meta.setAttribute(
			'content',
			surface && surface !== 'rgba(0, 0, 0, 0)' ? surface : isDark ? '#1c1917' : '#fff7ed'
		);
	});
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
			title: 'Doodle on this page',
			callback: () => {
				doodle.active = true;
			}
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

<PullCordSwitch />

<div
	id="layout-wrapper"
	class="w-full overflow-x-hidden bg-surface text-text-main relative min-h-screen"
>
	<Nav {isBlog} />
	<main class="relative z-10">
		{@render children?.()}
	</main>
	<!-- The garden and the work tour fill the window, so they go without a footer. -->
	{#if !['/garden', '/work/tour'].includes(page.url.pathname)}
		<Footer />
	{/if}
	<DoodleLayer />
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
