<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Fa from 'svelte-fa';
	import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
	import { scale } from 'svelte/transition';
	import { darkMode } from '$lib/utils/darkmode.js';

	function updateThemeClass(isDark) {
		if (!browser) return;
		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	function handleSwitchDarkMode() {
		darkMode.update((cur) => {
			const newValue = !cur;
			if (browser) {
				localStorage.theme = newValue ? 'dark' : 'light';
				updateThemeClass(newValue);
			}
			return newValue;
		});
		if (browser) {
			const wrapper = document.getElementById('layout-wrapper');
			if (wrapper) {
				wrapper.classList.remove('moon-impact');
				void wrapper.offsetWidth;
				wrapper.classList.add('moon-impact');
			}
			document.documentElement.classList.remove('moon-impact');
			document.body.classList.remove('moon-impact');
			requestAnimationFrame(() => {
				document.documentElement.classList.add('moon-impact');
				document.body.classList.add('moon-impact');
			});
			setTimeout(() => {
				if (wrapper) wrapper.classList.remove('moon-impact');
				document.documentElement.classList.remove('moon-impact');
				document.body.classList.remove('moon-impact');
			}, 300);
		}
	}

	onMount(() => {
		const isdark = localStorage.theme === 'dark';
		darkMode.set(isdark);
		updateThemeClass(isdark);
	});
</script>

<div class="text-inherit flex items-center justify-center">
	{#if $darkMode}
		<button
			in:scale
			class=" cursor-pointer self-center hover-animate"
			onclick={handleSwitchDarkMode}
			aria-label="Switch to light mode"
		>
			<Fa icon={faMoon} class="self-center" />
		</button>
	{:else}
		<button
			in:scale
			class=" cursor-pointer self-center hover-animate"
			onclick={handleSwitchDarkMode}
			aria-label="Switch to dark mode"
		>
			<Fa icon={faSun} class="self-center" />
		</button>
	{/if}
</div>
