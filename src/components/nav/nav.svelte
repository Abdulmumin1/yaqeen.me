<script>
	import Fa from 'svelte-fa';
	import NavItem from './navItem.svelte';
	import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
	import { scale, slide } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import BlogNav from './blogNav.svelte';
	$: darkMode = true;

	function handleSwitchDarkMode() {
		darkMode = !darkMode;
		localStorage.setItem('theme', darkMode ? 'dark' : 'light');

		if (browser) {
			if (
				localStorage.theme === 'dark' ||
				(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
			) {
				document.documentElement.classList.add('dark');
				darkMode = true;
			} else {
				document.documentElement.classList.remove('dark');
				darkMode = false;
			}
		}
	}

	onMount(() => {
		darkMode = localStorage.theme === 'dark';
	});

	export let isBlog;
</script>

<nav class="w-full font-medium flex justify-center items-center pt-3 flex-col relative">
	{#if !isBlog}
		<ul
			transition:slide
			class="flex gap-1 lg:gap-5 font-medium border px-2 border-orange-600 dark:border-dark border-b-2 md:border-b-4 space-x-2 rounded-lg items-center justify-center"
		>
			<NavItem data={{ name: 'Home', href: '/' }} />
			<!-- <p>·</p> -->
			<NavItem data={{ name: 'About', href: '/about' }} />
			<div class="text-4xl md:hover:text-5xl">
				{#if darkMode}
					<button
						in:scale
						class=" cursor-pointer p-3 self-center hover-animate"
						on:click={handleSwitchDarkMode}
					>
						<Fa icon={faMoon} class="self-center" />
					</button>
				{:else}
					<button
						in:scale
						class=" cursor-pointer p-3 self-center hover-animate"
						on:click={handleSwitchDarkMode}
					>
						<Fa icon={faSun} class="self-center" />
					</button>
				{/if}
			</div>

			<NavItem data={{ name: 'Blog', href: '/blog' }} />
			<!-- <p>·</p> -->
			<NavItem data={{ name: 'Projects', href: '/#projects' }} />
		</ul>
	{:else}
		<BlogNav />
	{/if}
</nav>

<style>
	.hover-animate {
		transition: font-size 0.15s ease-in-out; /* Transition on font-size property */
	}
</style>
