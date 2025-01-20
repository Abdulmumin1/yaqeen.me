<script>
	import { slide } from 'svelte/transition';

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
		$kbarState = !$kbarState;
	}
</script>

<div
	transition:slide
	class=" z-50 border-orang dark:border-dark w-full flex items-center justify-center"
>
	<ul
		class="w-full max-w-[800px] bg-orange-100 border-orang dark:border-dark border-b-2 rounded-full dark:bg-stone-800/50 flex justify-between py-6 px-3 pr-5 md:px-6 items-center mt-3"
	>
		<li>
			<a href="/blog" class="relative font-bold flex items-center justify-center">
				<h1>Home</h1>
				<!-- <img src="/signature.png " alt="logo" width="80" class="colorize" /> -->
			</a>
		</li>
		<li>
			<ul class="flex gap-5 items-center justify-center">
				<li class=" hidden md:block">
					<button on:click={toggleKbar} class="flex items-center gap-2">
						<span class="">Ctrl+K</span> <Fa icon={faSearch} /></button
					>
				</li>
				<li class=" hidden md:block">
					<a href="/about ">About</a>
				</li>
				<li class="flex items-center justify-center">
					<div class="w-full rounded-full flex items-center justify-center gap-2">
						<!-- <input
							value="search - alpha"
							class="bg-inherit border p-2 border-b-2 rounded-xl border-orang dark:border-dark"
							/> -->
						<Fa icon={faRss} />
						<a href="/rss.xml"> RSS</a>
					</div>
				</li>
				<li class=" py-2 flex items-center justify-center">
					<Darkmode />
				</li>
			</ul>
		</li>
	</ul>
</div>

<style>
	.bottom-nav {
		transform: translateY(-100%);
		transition: transform 0.5s;
	}

	.visible {
		transform: translateY(0);
	}

	.colorize {
		filter: brightness(0) saturate(100%) hue-rotate(0deg) sepia(100%) invert(100%) brightness(100%)
			contrast(100%);
		mix-blend-mode: color;
		background-color: rgb(255, 187, 110);
	}
</style>
