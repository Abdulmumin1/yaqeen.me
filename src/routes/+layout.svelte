<script>
	// import '../tailwind.css';
	import '../app.css';
	import Nav from '../components/nav/nav.svelte';
	import Footer from '../components/home/footer.svelte';
	import { page } from '$app/stores';
	import { KDialog, setKbarState } from 'kbar-svelte-mini';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { darkMode } from '$lib/utils/darkmode.js';

	setKbarState();
	$: isBlog = false;
	$: {
		isBlog = $page.url.pathname.startsWith('/blog') || $page.url.pathname.startsWith('/category');
	}

	let r = ['rounded-t-xl'];

	async function fetchPosts() {
		const response = await fetch('/blog/api/posts');
		const posts = await response.json();
		return posts;
	}

	function changeTheme(value) {
		darkMode.set(value);
	}
	let posts = [];

	$: actions = [
		{
			title: 'Home',
			callback: () => {
				goto('/');
			}
		},
		{
			title: 'About',
			callback: () => {
				goto('/about');
			}
		},
		{
			title: 'Projects',
			callback: () => {
				goto('/projects');
			}
		},
		{
			title: 'Blog',
			callback: () => {
				goto('/blog');
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
	];

	let loaded = false;

	onMount(async () => {
		let result = await fetchPosts();
		result.forEach((element) => {
			posts = [
				...posts,
				{
					title: element.title,
					subtitle: `${element.description.slice(0, 100)}...`,
					callback: () => {
						goto(`/blog/${element.slug}`);
					}
				}
			];
		});
		loaded = true;
	});
</script>

<div
	class="w-screen bg-orange-50 dark:text-orange-200 font-visby dark:bg-stone-950 relative transition-colors duration-500"
>
	<!-- dark:bg-[#040200] -->

	<Nav {isBlog} />
	<slot />
	<Footer />
	<!-- bg-[#08090a] -->
</div>
{#if loaded}
	<KDialog
		{actions}
		--bg={!$darkMode ? '#ffedd5' : '#1c1917'}
		--kbar-primary={$darkMode ? '#c04310' : '#f97316'}
		--kbar-gray={'#1c1917'}
		--shadow={'0px 0px 0px black'}
	/>
{/if}

<style>
</style>
