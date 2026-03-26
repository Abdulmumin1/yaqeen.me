<script>
	// import '../tailwind.css';
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
	import { fly, slide } from 'svelte/transition';
	import { setModalContext, setCurrentProjectInModal } from '$lib/utils/projectStore';
	import ProjectOverviewModal from '../components/projects/projectOverviewModal.svelte';
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();

	setModalContext();
	setCurrentProjectInModal();
	setKbarState();
	// console.log(page)
	let isBlog = $derived(
		page.url.pathname.startsWith('/blog') || page.url.pathname.startsWith('/category')
	);

	let r = ['rounded-t-xl'];

	async function fetchPosts() {
		const response = await fetch('/blog/api/posts');
		const posts = await response.json();
		return posts;
	}

	function changeTheme(value) {
		darkMode.set(value);
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
	let isDarkMode = $state(false);
	let showBannerVar = $state(false);
	let bannerTimeout = $state(null);
	let intialPass = $state(false);

	function showBanner() {
		console.log('dark mode is better.');
		clearTimeout(bannerTimeout);
		showBannerVar = true;
		bannerTimeout = setTimeout(() => {
			showBannerVar = false;
		}, 4000);
	}

	let unsubscribe = darkMode.subscribe((data) => {
		if (data && intialPass) {
			showBanner();
		} else if (showBannerVar) {
			showBannerVar = false;
		}
	});

	onMount(async () => {
		intialPass = true;
		isDarkMode =
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

		if (isDarkMode) {
			showBanner();
			setTimeout(() => {
				darkMode.set(false);
			}, 2000);
		}

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

		return () => {
			unsubscribe();
		};
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

<div
	class="w-screen overflow-x-hidden bg-surface text-text-main font-visby relative transition-colors duration-500"
>
	<Nav {isBlog} />
	{@render children?.()}
	{#if !['/garden'].includes(page.url.pathname)}
		<Footer />
	{/if}
</div>

{#if loaded}
	<KDialog
		{actions}
		--bg={!$darkMode ? '#ffedd5' : '#1c1917'}
		--kbar-primary={$darkMode ? '#c04310' : '#f97316'}
		--kbar-gray="#1c1917"
		--shadow={`0px .2px .2px ${$darkMode ? '#c04310' : '#f97316'}`}
	/>
{/if}

<div class="h-screen top-0 fixed w-screen z-50 pointer-events-none">
	<div class="relative h-full">
		<!-- SVG Backgrounds - only shown on non-home pages for minimalism -->
		{#if page.url.pathname !== '/'}
			<svg
				class="size-16 md:size-23 absolute left-12 top-36 -rotate-45 fill-primary/10"
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				viewBox="0 0 100 100"
			>
				<path
					d="m50 4.293c-25.23 0-45.715 20.473-45.715 45.703 0 25.23 20.484 45.715 45.715 45.715s45.715-20.484 45.715-45.715c0-25.23-20.484-45.703-45.715-45.703zm0 2.8477c23.688 0 42.855 19.172 42.855 42.855 0 23.688-19.172 42.855-42.855 42.855-23.688 0-42.855-19.172-42.855-42.855 0-23.688 19.172-42.855 42.855-42.855z"
				/>
			</svg>

			<svg
				class="size-11 md:size-19 absolute right-12 top-28 md:top-12 rotate-45 opacity-5 md:opacity-10 stroke-primary/20"
				viewBox="0 -2.5 160 160"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M77.641 109.484C72.9009 109.484 65.9845 107.282 59.4934 103.692C55.9045 101.703 52.8079 99.087 50.9573 95.2983C50.3885 94.3292 50.0498 93.2424 49.9673 92.1217C49.9971 91.0383 50.0351 90.0267 51.0894 89.5737"
				/>
			</svg>
		{/if}
	</div>
</div>
<ProjectOverviewModal />

<style>
	:global(.dark) {
		color-scheme: dark;
	}
</style>
