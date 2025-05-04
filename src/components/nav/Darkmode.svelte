<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	import Fa from 'svelte-fa';

	import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
	import { scale } from 'svelte/transition';
	import { darkMode } from '$lib/utils/darkmode.js';

	let mounted = false;

	let darkModeSubscribe = darkMode.subscribe((data) => {
		if (browser && mounted) {
			localStorage.setItem('theme', data ? 'dark' : 'light');
			if (
				localStorage.theme === 'dark' ||
				(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
			) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	});
	function handleSwitchDarkMode() {
		darkMode.update((cur) => {
			return !cur;
		});
	}

	onMount(() => {
		let isdark = localStorage.theme == 'dark';
		darkMode.set(isdark);
		mounted = true;

		return () => {
			darkModeSubscribe();
		};
	});
</script>

<div class="text-inherit flex items-center justify-center">
	{#if $darkMode}
		<button
			in:scale
			class=" cursor-pointer self-center hover-animate"
			onclick={handleSwitchDarkMode}
		>
			<Fa icon={faMoon} class="self-center" />
		</button>
	{:else}
		<button
			in:scale
			class=" cursor-pointer self-center hover-animate"
			onclick={handleSwitchDarkMode}
		>
			<Fa icon={faSun} class="self-center" />
		</button>
	{/if}
</div>
