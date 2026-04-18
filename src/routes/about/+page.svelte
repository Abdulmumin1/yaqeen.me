<script>
	import Seo from '$components/general/seo.svelte';
	import {
		authorName,
		authorUrl,
		defaultSocialImage,
		siteOrigin,
		socialProfiles
	} from '$lib/js/config.js';
	import me from '$lib/images/me.jpeg';
	import { faGithub, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
	import Fa from 'svelte-fa';

	const profileNotes = [
		'hey. hey!',
		'too close',
		'might be taken btw.',
		'still just me',
		'ok that is enough',
		'still checking me out?',
		'Ah! shoot me an email then'
	];
	let noteIndex = $state(0);
	let isHovered = $state(false);
	let interactionTimer = $state(null);

	let profileNote = $derived(profileNotes[noteIndex]);
	let showTooltip = $derived(isHovered || interactionTimer !== null);

	const bragBits = [
		'part-time fullstack dev',
		'cyber security graduate',
		'python + javascript person',
		'professional tab hoarder'
	];

	const interests = [
		{
			title: 'Writing',
			description:
				'Mostly about dev, security, and whatever technical rabbit hole has ruined my evening.'
		},
		{
			title: 'Sketching',
			description: 'Not in a gallery sense. More in a doodling interfaces and strange logos sense.'
		},
		{
			title: 'Photography',
			description: 'My long-running backup plan if software ever starts feeling too polite.'
		},
		{
			title: 'Taking walks',
			description: 'My long-running backup plan if software ever starts feeling too polite.'
		},
		{
			title: 'Coffee',
			description: 'Less an interest, more a recurring infrastructure dependency.'
		}
	];

	function handleInteraction() {
		if (typeof navigator !== 'undefined' && navigator.vibrate) {
			navigator.vibrate(40);
		}

		noteIndex = (noteIndex + 1) % profileNotes.length;

		if (interactionTimer) clearTimeout(interactionTimer);
		interactionTimer = setTimeout(() => {
			interactionTimer = null;
			setTimeout(() => {
				if (!isHovered && !interactionTimer) noteIndex = 0;
			}, 300);
		}, 2500);
	}

	function handleMouseEnter() {
		// Only trigger on actual mouse devices (not touch events posing as mouseenter)
		if (window.matchMedia('(hover: hover)').matches) {
			isHovered = true;
			if (noteIndex === 0) noteIndex = 1;
		}
	}

	function handleMouseLeave() {
		if (window.matchMedia('(hover: hover)').matches) {
			isHovered = false;
			if (!interactionTimer) {
				setTimeout(() => {
					if (!isHovered && !interactionTimer) noteIndex = 0;
				}, 300);
			}
		}
	}

	const aboutSchema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: authorName,
		url: authorUrl,
		image: `${siteOrigin}${me}`,
		description: 'Fullstack developer, cyber security graduate, and writer.',
		sameAs: socialProfiles
	});
</script>

<svelte:head>
	<Seo
		title="About | Abdulmumin Yaqeen"
		description="About Abdulmumin Yaqeen, a fullstack developer, cyber security graduate, and writer."
		canonical={`${siteOrigin}/about`}
		image={defaultSocialImage}
	/>
	<svelte:element this={'script'} type="application/ld+json">{aboutSchema}</svelte:element>
</svelte:head>

<div class="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-8">
	<div class="flex flex-col gap-6">
		<p class="text-[9px] font-mono uppercase tracking-[0.3em] text-text-muted">/about</p>

		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-4">
				<button
					type="button"
					class="profile-image group relative block shrink-0"
					onclick={handleInteraction}
					onmouseenter={handleMouseEnter}
					onmouseleave={handleMouseLeave}
					aria-label="Profile image"
				>
					<span class="profile-frame">
						<img src={me} alt="Abdulmumin Yaqeen" class="w-20 h-20 object-cover" />
					</span>
					<span
						class="profile-note pointer-events-none absolute left-0 sm:left-1/2 top-full mt-2 whitespace-nowrap rounded-full border border-primary/10 bg-surface px-2 py-1 text-[8px] font-mono uppercase tracking-[0.2em] text-primary {showTooltip
							? 'is-visible'
							: ''}"
					>
						{profileNote}
					</span>
				</button>
			</div>

			<!-- <div class="flex gap-3 text-xs opacity-60">
				<a
					href="https://github.com/Abdulmumin1"
					aria-label="GitHub"
					class="hover:opacity-100 transition-opacity"
				>
					<Fa icon={faGithub} />
				</a>
				<a
					href="https://linkedin.com/in/abdulmuminyqn"
					aria-label="LinkedIn"
					class="hover:opacity-100 transition-opacity"
				>
					<Fa icon={faLinkedin} />
				</a>
				<a
					href="https://twitter.com/@abdulmuminyqn"
					aria-label="Twitter"
					class="hover:opacity-100 transition-opacity"
				>
					<Fa icon={faTwitter} />
				</a>
				<a
					href="https://youtube.com/@abdulmuminyqn"
					aria-label="YouTube"
					class="hover:opacity-100 transition-opacity"
				>
					<Fa icon={faYoutube} />
				</a>
			</div> -->
		</div>
	</div>

	<div class="flex flex-col gap-4 text-xs text-text-muted leading-relaxed">
		<p>I'm Abdulmumin Yaqeen</p>
		<p>I do stuff, mostly a developer.</p>
		<p>
			Use to run a <a class="text-primary underline" href="https://www.youtube.com/@abdulmuminyqn"
				>youtube channel</a
			> a few years ago
		</p>
	</div>

	<div class="flex flex-col gap-4">
		<p class="text-[9px] font-mono tracking-[0.3em] text-text-muted">/defaults</p>
		<ul class="flex flex-col divide-y divide-primary/10">
			<li class="py-3 text-xs text-text-muted">
				Usually building, writing, sketching, or taking apart something that was already working.
			</li>
			<li class="py-3 text-xs text-text-muted">
				Recurring themes: dev tools, security, interfaces, experiments, and curiosity with bad time
				management.
			</li>
			<li class="py-3 text-xs text-text-muted">and VERY PICKY, asthetically</li>
		</ul>
	</div>

	<div class="flex flex-col gap-4">
		<p class="text-[9px] font-mono tracking-[0.3em] text-text-muted">/interests</p>
		<ul class="flex flex-col divide-y divide-primary/10">
			{#each interests as interest (interest.title)}
				<li class="py-3 text-xs text-text-muted">
					<span class="text-primary font-bold">{interest.title}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.profile-image {
		--profile-rotate: -1.4deg;
		--profile-lift: -1px;
		--profile-shadow-y: 10px;
		--profile-shadow-blur: 24px;
		--profile-shadow-color: color-mix(in srgb, var(--color-primary) 12%, transparent);
		outline: none;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.profile-frame {
		position: relative;
		display: block;
		border-radius: 0.9rem;
		overflow: hidden;
	}

	.profile-frame::before {
		content: '';
		position: absolute;
		inset: 0;
		border: 1px solid color-mix(in srgb, var(--color-primary) 10%, transparent);
		border-radius: inherit;
		z-index: 1;
		transition:
			border-color 260ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 260ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.profile-frame::after {
		content: '';
		position: absolute;
		inset: -0.35rem;
		border: 1px dashed color-mix(in srgb, var(--color-primary) 18%, transparent);
		border-radius: 1.1rem;
		opacity: 0;
		transform: scale(0.985);
		transition:
			opacity 300ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
			border-color 300ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.profile-image img {
		display: block;
		border-radius: 0.9rem;
		box-shadow: 0 var(--profile-shadow-y) var(--profile-shadow-blur) var(--profile-shadow-color);
		transition:
			transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
			filter 320ms cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 420ms cubic-bezier(0.22, 1, 0.36, 1);
		transform: translateY(0) rotate(0deg) scale(1);
		filter: saturate(0.98) contrast(1);
		transform-origin: 50% 58%;
	}

	@media (hover: hover) {
		.profile-image:hover img,
		.profile-image:focus-visible img {
			transform: translateY(var(--profile-lift)) rotate(var(--profile-rotate)) scale(1.018);
			filter: saturate(1.04) contrast(1.02);
			box-shadow: 0 14px 30px color-mix(in srgb, var(--color-primary) 16%, transparent);
		}

		.profile-image:hover .profile-frame::before,
		.profile-image:focus-visible .profile-frame::before {
			border-color: color-mix(in srgb, var(--color-primary) 22%, transparent);
		}

		.profile-image:hover .profile-frame::after,
		.profile-image:focus-visible .profile-frame::after {
			opacity: 1;
			transform: scale(1);
			border-color: color-mix(in srgb, var(--color-primary) 26%, transparent);
		}
	}

	.profile-image:active img {
		transform: translateY(0) scale(0.992) rotate(0.6deg);
		box-shadow: 0 8px 18px color-mix(in srgb, var(--color-primary) 14%, transparent);
		transition: all 120ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Separate active state for non-hover devices (mobile) */
	@media (hover: none) {
		.profile-image:active img {
			transform: scale(0.992) rotate(0.6deg);
			transition: all 80ms ease-out;
		}
	}

	.profile-note {
		transform: translateY(-4px);
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 180ms ease,
			transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
			border-color 220ms ease,
			visibility 180ms;
	}

	.profile-note.is-visible {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
		border-color: color-mix(in srgb, var(--color-primary) 18%, transparent);
	}

	@media (min-width: 640px) {
		.profile-note {
			transform: translateX(-50%) translateY(-4px);
		}
		.profile-note.is-visible {
			transform: translateX(-50%) translateY(0);
		}
	}
</style>
