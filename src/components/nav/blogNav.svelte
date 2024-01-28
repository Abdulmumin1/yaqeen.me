<script>
	import { slide } from 'svelte/transition';

	import Fa from 'svelte-fa';
	import { faRss } from '@fortawesome/free-solid-svg-icons';
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
	class:visible={showNav}
	class="bottom-nav max-w-[1600px] z-50 fixed bg-orange-100 border-b-2 border-orang dark:border-dark dark:bg-stone-900 w-full flex items-center justify-center"
>
	<ul class=" w-full flex justify-between py-6 px-3 items-center mt-12">
		<li>
			<a href="/blog" class="relative font-bold flex items-center justify-center">
				<h1>Home</h1>
				<!-- <img src="/signature.png " alt="logo" width="80" class="colorize" /> -->
			</a>
		</li>
		<li>
			<ul class="flex gap-2 items-center justify-center">
				<li
					class="bg-orange-200 dark:bg-stone-800 dark:text-orange-300 p-2 px-3 rounded-full text-black text-sm"
				>
					<button on:click={toggleKbar}> Search <span class="">Ctrl+K</span></button>
				</li>
				<li class="flex items-center justify-center">
					<a href="/about ">About</a>
				</li>
				<li class="flex items-center justify-center">
					<div class="w-full flex items-center justify-center gap-2">
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
