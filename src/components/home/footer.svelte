<script>
	import { resolve } from '$app/paths';
	import Fa from 'svelte-fa';
	import { faGithub, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
	import { copyUrlToClipboard } from '$lib/js/utils.js';
	import { darkMode } from '$lib/utils/darkmode.js';

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
	<video
		class="butterfly-overlay"
		src={resolve('/butterflies-loop.webm')}
		autoplay
		muted
		loop
		playsinline
		preload="metadata"
		aria-hidden="true"
	></video>

	<div class="footer-content max-w-2xl mx-auto w-full flex flex-col gap-3 relative">
		<!-- Beautiful watercolor ginkgo tree standing tall on the left of footer content -->

		<div class="flex gap-3">
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
		</div>

		<!-- Swaying watercolor flower next to the butterflies loop -->
		<div
			class="absolute right-0 bottom-0 w-16 h-16 sm:w-20 sm:h-20 pointer-events-none select-none opacity-80 dark:opacity-75 animate-sway"
		>
			<img
				src="/flower-red.webp"
				alt="Watercolor flower decoration"
				class="w-full h-full object-contain"
			/>
		</div>
	</div>
</footer>

<style>
	.butterfly-footer {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		min-height: 16rem;
		justify-content: flex-end;
	}

	.butterfly-overlay {
		position: absolute;
		z-index: -1;
		inset: auto;
		top: 0;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 42%;
		pointer-events: none;
		opacity: 0.76;
		filter: hue-rotate(-15deg) saturate(1.8) brightness(1.05);
	}

	.footer-content {
		position: relative;
		z-index: 1;
	}

	@media (max-width: 640px) {
		.butterfly-footer {
			min-height: 13rem;
		}

		.butterfly-overlay {
			width: 145%;
			left: 50%;
			transform: translateX(-50%);
			max-width: none;
			opacity: 0.68;
		}
	}

	@media (min-width: 1024px) {
		.butterfly-footer {
			min-height: 20rem;
		}

		.butterfly-overlay {
			width: 100%;
			max-width: 1200px;
			left: 50%;
			transform: translateX(-50%);
			object-position: center 42%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.butterfly-overlay {
			display: none;
		}
	}

	@keyframes sway {
		0%,
		100% {
			transform: rotate(-2deg) translateY(0px);
		}
		50% {
			transform: rotate(3deg) translateY(-3px);
		}
	}

	@keyframes sway-slow {
		0%,
		100% {
			transform: rotate(-1.5deg) translateY(0px);
		}
		50% {
			transform: rotate(2deg) translateY(-3px);
		}
	}
	@media (prefers-reduced-motion: no-preference) {
		.animate-sway {
			animation: sway 6s ease-in-out infinite;
		}

		.animate-sway-slow {
			animation: sway-slow 8s ease-in-out infinite;
		}
	}
</style>
