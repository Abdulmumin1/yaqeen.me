<script>
	// import { slide } from 'svelte/transition';

	import Fa from 'svelte-fa';
	import { faRss, faSearch } from '@fortawesome/free-solid-svg-icons';
	import { getKbarState } from 'kbar-svelte-mini';
	import { onMount, onDestroy } from 'svelte';
	import Darkmode from './Darkmode.svelte';

	let showNav = true;

	let hideTimeout;
	let element;

	const showNavigation = () => {
		showNav = true;
		// Hide after 3 seconds of inactivity
	};
	let kbarState = getKbarState();
	onMount(() => {
		let prevScrollPos = window.pageYOffset;

		const handleScroll = () => {
			const currentScrollPos = window.pageYOffset;

			if (prevScrollPos > currentScrollPos) {
				showNavigation();
				// console.log('show nav');
			} else {
				showNav = false;
			}

			prevScrollPos = currentScrollPos;
		};

		window.addEventListener('scroll', handleScroll);
		// element.addEventListener('mouseover', showNavigation);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	function toggleKbar() {
		kbarState.value = !kbarState.value;
	}
</script>

<div class="z-50 px-4 w-full flex items-center justify-center sticky top-0">
	<ul
		class="w-full max-w-2xl bg-surface-soft/80 backdrop-blur-md bg-surface/80 flex justify-between py-3 px-6 items-center"
	>
		<li>
			<a
				href="/"
				class="text-xs font-bold tracking-widest uppercase text-text-muted hover:text-text-main transition-colors"
			>
				home
			</a>
		</li>
		<li>
			<ul
				class="flex gap-6 items-center justify-center text-[10px] font-mono uppercase text-text-muted"
			>
				<li class="hidden md:block hover:text-text-main transition-colors">
					<button onclick={toggleKbar} class="flex items-center gap-2">
						Search <Fa icon={faSearch} /></button
					>
				</li>
				<li class="hover:text-text-main transition-colors">
					<a href="/blog">Blog</a>
				</li>
				<li class="hover:text-text-main transition-colors">
					<a href="/projects">Work</a>
				</li>
				<li class="flex items-center justify-center hover:text-text-main transition-colors">
					<a href="/rss.xml" class="flex items-center gap-1">RSS</a>
				</li>
			</ul>
		</li>
	</ul>
</div>

<style>
</style>
