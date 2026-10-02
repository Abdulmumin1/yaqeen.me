<script>
	import { resolve } from '$app/paths';
	import Fa from 'svelte-fa';
	import { faGithub, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
	import { copyUrlToClipboard } from '$lib/js/utils.js';
	import { darkMode } from '$lib/utils/darkmode.js';
	import { doodle } from '$components/general/doodle.svelte.js';
	import ButterflyGarden from '$components/general/butterflyGarden.svelte';
	import GardenBed from '$components/general/gardenBed.svelte';

	const links = {
		github: 'https://github.com/Abdulmumin1',
		linkedin: 'https://linkedin.com/in/abdulmuminyqn',
		twitter: 'https://twitter.com/abdulmuminyqn',
		youtube: 'https://youtube.com/@abdulmuminyqn',
		hashnode: 'https://avdurr.hashnode.dev'
	};

	const emailAddress = 'abdulmuminyqn@gmail.com';

	let copiedEmail = $state(false);
	let resetTimer = $state(null);

	function copyEmailAddress() {
		copyUrlToClipboard(emailAddress);
		copiedEmail = true;

		if (resetTimer) clearTimeout(resetTimer);
		resetTimer = setTimeout(() => {
			copiedEmail = false;
		}, 2000);
	}

	function toggleTheme() {
		const newValue = !$darkMode;
		darkMode.set(newValue);
		localStorage.theme = newValue ? 'dark' : 'light';
		if (newValue) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
</script>

<footer class="butterfly-footer w-full py-10 px-6 flex flex-col gap-3 text-xs text-text-muted">
	<!-- A few live butterflies. They sit on whatever in here is marked data-perch... -->
	<ButterflyGarden />

	<!-- ...which includes the flowers they come for, standing along the bottom edge. -->
	<div class="flower-bed"><GardenBed /></div>

	<div class="footer-content max-w-2xl mx-auto w-full flex flex-col gap-3 relative">
		<!-- Beautiful watercolor ginkgo tree standing tall on the left of footer content -->

		<div class="flex gap-3" data-perch>
			<a
				href={links.github}
				aria-label="GitHub profile"
				class="hover:text-text-main transition-colors"
			>
				<Fa icon={faGithub} />
			</a>
			<a
				href={links.linkedin}
				aria-label="LinkedIn profile"
				class="hover:text-text-main transition-colors"
			>
				<Fa icon={faLinkedin} />
			</a>
			<a
				href={links.twitter}
				aria-label="Twitter profile"
				class="hover:text-text-main transition-colors"
			>
				<Fa icon={faTwitter} />
			</a>
			<a
				href={links.youtube}
				aria-label="YouTube channel"
				class="hover:text-text-main transition-colors"
			>
				<Fa icon={faYoutube} />
			</a>
		</div>

		<div class="flex flex-col gap-1">
			<button
				type="button"
				onclick={copyEmailAddress}
				class="w-fit text-left hover:text-primary transition-colors"
				aria-label="Copy email address"
				data-perch
			>
				{copiedEmail ? 'email copied' : 'copy email'}
			</button>
		</div>

		<div class="flex gap-2 text-[10px]">
			<a href="/about" class="hover:text-text-main transition-colors">about</a>
			<span>/</span>
			<a href={links.linkedin} class="hover:text-text-main transition-colors">linkedin</a>
			<span>/</span>
			<a href={resolve('/photos')} class="hover:text-text-main transition-colors">photos</a>
			<span>/</span>
			<button
				type="button"
				onclick={toggleTheme}
				class="hover:text-text-main transition-colors cursor-pointer touch-manipulation"
			>
				{$darkMode ? 'light mode' : 'dark mode'}
			</button>
			<span>/</span>
			<button
				type="button"
				onclick={() => (doodle.active = true)}
				class="hover:text-text-main transition-colors cursor-pointer touch-manipulation"
				data-perch
			>
				doodle
			</button>
		</div>
	</div>
</footer>

<style>
	/* Tall enough to leave the butterflies some air above the links. */
	.butterfly-footer {
		position: relative;
		isolation: isolate;
		min-height: 16rem;
		justify-content: flex-end;
	}

	.footer-content {
		position: relative;
		z-index: 1;
	}

	/* Rooted on the bottom edge of the page, about the right-hand end of the text column. */
	.flower-bed {
		position: absolute;
		right: max(0.5rem, calc(50% - 28rem));
		bottom: 0;
		z-index: 0;
		width: clamp(6.75rem, 28vw, 20rem);
		height: 12rem;
		pointer-events: none;
	}

	@media (max-width: 640px) {
		.butterfly-footer {
			min-height: 13rem;
		}

		.flower-bed {
			height: 9.5rem;
		}
	}

	@media (min-width: 1024px) {
		.butterfly-footer {
			min-height: 20rem;
		}
	}
</style>
