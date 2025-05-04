<script>
	import Fa from 'svelte-fa';
	import NavItem from './navItem.svelte';
	import { slide } from 'svelte/transition';
	import BlogNav from './blogNav.svelte';
	import Darkmode from './Darkmode.svelte';

	let { isBlog } = $props();
</script>

<nav class="w-full font-medium flex justify-center items-center pt-3 flex-col relative">
	{#if !isBlog}
		<ul
			transition:slide
			class="flex top-1 gap-1 lg:gap-3 font-medium border px-2 border-orange-600 dark:border-dark border-b-2 rounded-3xl items-center justify-center"
		>
			<NavItem data={{ name: 'Home', href: '/' }} />
			<!-- <p>·</p> -->
			<NavItem data={{ name: 'About', href: '/about' }} />
			<div class="text-4xl p-3">
				<Darkmode />
			</div>
			<NavItem data={{ name: 'Blog', href: '/blog' }} />
			<!-- <p>·</p> -->
			<NavItem data={{ name: 'Projects', href: '/projects' }} />
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
