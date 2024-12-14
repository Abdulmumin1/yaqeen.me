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
	import { fly, slide } from 'svelte/transition';
	import { setModalContext, setCurrentProjectInModal } from '$lib/utils/projectStore';
	import ProjectOverviewModal from '../components/projects/projectOverviewModal.svelte';

	setModalContext();
	setCurrentProjectInModal();
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
	let canonical = null;
	let isDarkMode;
	let showBannerVar = false;
	let bannerTimeout;
	let intialPass = false;

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
		let url = window.location.hostname;
		// insertCopyButton(faCopy);
		if (url.startsWith('www.')) {
			canonical = window.location.href.replace('www.', '');
		} else {
			canonical = 'https://www.' + window.location.hostname + window.location.pathname;
		}

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

		return () => {
			unsubscribe();
		};
	});
</script>

<svelte:head>
	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}
</svelte:head>

<div
	class="w-screen bg-orange-50 dark:text-orange-200 font-visby dark:bg-stone-950 relative transition-colors duration-500"
>
	<!-- dark:bg-[#040200] -->

	<Nav {isBlog} />
	<slot />
	<Footer />
	<!-- bg-[#08090a] -->
</div>

<!-- {#if showBannerVar}
	<div transition:fly={{ y: 20 }} class="assistant">
		<div class="speech-bubble">
			<p>Light mode is better</p>
		</div>
		<div class="clippy">

			<img
				src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExejl2b3VkaXBqbHJpeWUzdng4Z3RvYXEzaWkwanIyOTQ4Ym00b2VudiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/s1AxxupkX45GsPQVHL/giphy.gif"
				alt=""
				srcset=""
			/>
		</div>
		<button
			class="dismiss"
			on:click={() => {
				clearTimeout(bannerTimeout);
				showBannerVar = false;
			}}>✖</button
		>
	</div>
{/if} -->
{#if loaded}
	<KDialog
		{actions}
		--bg={!$darkMode ? '#ffedd5' : '#1c1917'}
		--kbar-primary={$darkMode ? '#c04310' : '#f97316'}
		--kbar-gray={'#1c1917'}
		--shadow={`0px .2px .2px ${$darkMode ? '#c04310' : '#f97316'}`}
	/>
{/if}

<ProjectOverviewModal />

<style>
	.assistant {
		position: fixed;
		right: 20px;
		bottom: 20px;
		display: flex;
		align-items: flex-end;
		font-family: Arial, sans-serif;
		background-color: transparent;
	}

	.speech-bubble {
		position: absolute;
		z-index: 999;
		width: 100%;
		color: white;
		font-weight: bolder;
		font-size: 30px;
		left: 50%;
		bottom: 0;
		transform: translateX(-50%);
		text-align: center;
		-webkit-text-fill-color: white; /*Will override color (regardless of order)*/
		-webkit-text-stroke: 1px black;
	}

	.clippy {
		width: 300px;
		/* height: 60px; */

		background: #ccc;
		border: 2px solid #000;
		border-radius: 0 0 50% 50%;
		position: relative;
		border-radius: 1.125rem;
	}
	.clippy img {
		border-radius: 1.125rem;
	}

	.eyes::before,
	.eyes::after {
		content: '';
		position: absolute;
		width: 10px;
		height: 10px;
		background: #000;
		border-radius: 50%;
		top: 15px;
	}

	.eyes::before {
		left: 15px;
	}
	.eyes::after {
		right: 15px;
	}

	.body::before {
		content: '';
		position: absolute;
		width: 20px;
		height: 30px;
		background: #000;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}

	button {
		background: #f0f0f0;
		border: 1px solid #ccc;
		padding: 5px 10px;
		margin-top: 10px;
		cursor: pointer;
	}

	.dismiss {
		position: absolute;
		top: 0;
		right: 0;
		background: none;
		border: none;
		font-size: 16px;
		cursor: pointer;
	}
</style>
