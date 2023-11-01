<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	import Fa from 'svelte-fa';

	import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
	import { scale } from 'svelte/transition';

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

<div class="text-inherit flex items-center justify-center">
	{#if darkMode}
		<button
			in:scale
			class=" cursor-pointer self-center hover-animate"
			on:click={handleSwitchDarkMode}
		>
			<Fa icon={faMoon} class="self-center" />
		</button>
	{:else}
		<button
			in:scale
			class=" cursor-pointer self-center hover-animate"
			on:click={handleSwitchDarkMode}
		>
			<Fa icon={faSun} class="self-center" />
		</button>
	{/if}
</div>
