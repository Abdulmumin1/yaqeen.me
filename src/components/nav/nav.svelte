<script>
	import Fa from 'svelte-fa';
	import NavItem from '../navItem.svelte';
	import {
		faLightbulb,
		faMoon,
		faStar,
		faStarAndCrescent,
		faStarOfLife,
		faSun
	} from '@fortawesome/free-solid-svg-icons';
	import { scale } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
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
		// darkMode = localStorage.theme === 'dark';
	});
</script>

<nav
	class="w-full border-b-2 dark:border-[#333] border-black flex justify-center items-center flex-col"
>
	<div class="text-3xl">
		{#if darkMode}
			<button in:scale class=" cursor-pointer p-3 self-center" on:click={handleSwitchDarkMode}>
				<Fa icon={faMoon} class="self-center" />
			</button>
		{:else}
			<button in:scale class=" cursor-pointer p-3 self-center" on:click={handleSwitchDarkMode}>
				<Fa icon={faSun} class="self-center" />
			</button>
		{/if}
	</div>
	<ul class="flex space-x-2 p-1 rounded-lg border-black dark:border-[#333]">
		<NavItem data={{ name: 'Home', href: '/' }} />
		<NavItem data={{ name: 'About', href: '/' }} />

		<NavItem data={{ name: 'Blog', href: '/' }} />
		<NavItem data={{ name: 'Projects', href: '/' }} />
	</ul>
</nav>
