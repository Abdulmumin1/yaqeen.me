<script>
	import { slide } from 'svelte/transition';

	import Fa from 'svelte-fa';
	import { faRss } from '@fortawesome/free-solid-svg-icons';

	import { onMount, onDestroy } from 'svelte';
	import Darkmode from './Darkmode.svelte';

	let showNav = true;

	let hideTimeout;
	let element;

	const showNavigation = () => {
		showNav = true;
		// Hide after 3 seconds of inactivity
	};

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
</script>

<ul
	transition:slide
	class:visible={showNav}
	class="bottom-nav w-full flex justify-between py-6 px-3 z-50 fixed bg-orange-100 items-center mt-12 border-b-2 border-orang dark:border-dark dark:bg-stone-900"
>
	<li>
		<a href="/blog" class="font-bold flex items-center justify-center w-20 dark:invert"
			><img src="/signature.png " alt="logo" width="80" /></a
		>
	</li>
	<li>
		<ul class="flex gap-2 items-center justify-center">
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

<style>
	.bottom-nav {
		transform: translateY(-100%);
		transition: transform 0.5s;
	}

	.visible {
		transform: translateY(0);
	}
</style>
