<script>
	import Fa from 'svelte-fa';
	import NavItem from './navItem.svelte';
	import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
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
		darkMode = localStorage.theme === 'dark';
	});
</script>

<nav class="w-full flex justify-center items-center flex-col pt-3 font-bold">
	<ul
		class="flex border px-2 border-black dark:border-[#333] border-b-4 space-x-2 rounded-lg items-center justify-center"
	>
		<NavItem data={{ name: 'Home', href: '/' }} />
		<p>·</p>
		<NavItem data={{ name: 'About', href: '/about' }} />
		<div class="text-4xl">
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

		<NavItem data={{ name: 'Blog', href: '/#blog' }} />
		<p>·</p>
		<NavItem data={{ name: 'Projects', href: '/#projects' }} />
	</ul>
</nav>
