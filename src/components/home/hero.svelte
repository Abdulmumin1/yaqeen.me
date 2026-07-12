<script>
	import { highlight } from '@highlighters/svelte';

	const socials = [
		{ name: 'github', href: 'https://github.com/Abdulmumin1' },
		{ name: 'linkedin', href: 'https://linkedin.com/in/abdulmuminyqn' },
		{ name: 'twitter', href: 'https://twitter.com/abdulmuminyqn' },
		{ name: 'email', href: 'mailto:abdulmuminyqn@gmail.com' }
	];

	let note = $state('Click for a small note');
	let noteVisible = $state(false);
	let shook = $state(false);
	let noteTimer;

	function orbitMoon() {
		note = 'clap for yourself';
		noteVisible = true;
		shook = true;

		clearTimeout(noteTimer);
		noteTimer = setTimeout(() => { noteVisible = false; shook = false; }, 2200);

		if ('vibrate' in navigator) navigator.vibrate(12);
	}
</script>

<div class=" max-w-xl">
	<div class="mb-8 moon-wrap">
		<button
			type="button"
			class:shook
			class="moon-button"
			onclick={orbitMoon}
			aria-label="Reveal a note from the moon"
			aria-describedby="moon-note"
		>
			<img src="/favicon.png" alt="" class="moon-icon grayscale opacity-80 dark:invert" />
		</button>
		<span id="moon-note" class:note-visible={noteVisible} class="moon-note" aria-live="polite">{note}</span
		>
	</div>

	<h1
		class="text-2xl sm:text-3xl md:text-5xl font-serif mb-5 leading-tight text-text-main md:whitespace-nowrap"
	>
		Hi, call me
		<span class="relative inline-block group font-extralight font-meri cursor-help text-accent">
			<span
				id="legal-name-tooltip"
				class="pointer-events-none absolute -top-3 left-1/2 z-20 -translate-x-1/2 rotate-4 whitespace-nowrap rounded-full bg-accent px-4 py-1.5 font-serif text-sm italic text-white opacity-0 transition duration-200 group-hover:-translate-y-1 group-hover:opacity-100 group-focus-within:-translate-y-1 group-focus-within:opacity-100 md:-top-12 md:text-base"
				role="tooltip"
			>
				legally "abdulmumin abdulkarim" :)
			</span>

			<span
				use:highlight={{
					markType: 'underline',
					color: '#f9411f',
					opacity: 0.55,
					vivid: true,
					renderer: 'css',
					tip: { angle: 100, overshoot: 13 },
					ink: { flow: 1, feathering: 1, streakiness: 1 },
					edge: { waviness: 1, roughness: 1, cap: 'round' },
					animation: { duration: 300, trigger: 'in-view' }
				}}
			>
				yaqeen</span
			></span
		>
	</h1>

	<div class="text-base sm:text-lg md:text-xl font-visby text-text-muted leading-relaxed">
		<p class="text-balance">
			I enjoy building products. I also write a lot, and some of it ends up here on my blog.
		</p>
	</div>

	<div class="flex flex-wrap gap-x-6 gap-y-2 mt-5">
		{#each socials as social}
			<a
				href={social.href}
				class=" text-text-muted transition-colors text-base font-mono tracking-widest uppercase"
			>
				{social.name}
			</a>
		{/each}
	</div>
</div>


<style>
	.moon-wrap {
		position: relative;
		width: fit-content;
	}

	.moon-button {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 999px;
		cursor: pointer;
	}

	.moon-icon {
		width: 2.5rem;
		height: 2.5rem;
		transition:
			transform 500ms cubic-bezier(0.16, 1, 0.3, 1),
			filter 300ms ease;
	}

	.moon-button:hover .moon-icon,
	.moon-button:focus-visible .moon-icon {
		transform: rotate(12deg) scale(1.08);
		filter: drop-shadow(0 0 0.45rem color-mix(in srgb, var(--color-accent) 55%, transparent));
	}

	.moon-button.shook .moon-icon {
		animation: shake 360ms cubic-bezier(0.36, 0.07, 0.19, 0.97);
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		16%  { transform: translateX(-4px) rotate(-3deg); }
		32%  { transform: translateX(4px) rotate(3deg); }
		48%  { transform: translateX(-3px) rotate(-2deg); }
		64%  { transform: translateX(2px) rotate(1deg); }
		80%  { transform: translateX(-1px); }
	}

	.moon-note {
		position: absolute;
		top: 50%;
		left: 3.25rem;
		width: max-content;
		max-width: min(15rem, calc(100vw - 6rem));
		transform: translateY(-50%);
		font-family: var(--font-meri);
		font-size: 0.75rem;
		font-style: italic;
		color: var(--color-text-muted);
		opacity: 0;
		transition:
			opacity 180ms ease,
			transform 180ms ease;
		pointer-events: none;
	}

	.moon-button:hover + .moon-note,
	.moon-button:focus-visible + .moon-note,
	.moon-note.note-visible {
		opacity: 1;
		transform: translate(0.2rem, -50%);
	}

	@media (prefers-reduced-motion: reduce) {
		.moon-icon,
		.moon-note {
			transition: none;
		}
	}
</style>
