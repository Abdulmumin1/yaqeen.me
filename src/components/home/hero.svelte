<script>
	import { highlight } from '@highlighters/svelte';

	const socials = [
		{ name: 'github', href: 'https://github.com/Abdulmumin1' },
		{ name: 'linkedin', href: 'https://linkedin.com/in/abdulmuminyqn' },
		{ name: 'twitter', href: 'https://twitter.com/abdulmuminyqn' },
		{ name: 'email', href: 'mailto:abdulmuminyqn@gmail.com' }
	];
</script>

<div class=" max-w-xl">
	<div class="mb-8">
		<img src="/favicon.png" alt="Icon" class="w-10 h-10 grayscale opacity-80 dark:invert" />
	</div>

	<h1
		class="text-2xl sm:text-3xl md:text-5xl font-serif mb-5 leading-tight text-text-main md:whitespace-nowrap"
	>
		Hi, call me
		<span class="relative inline-block group font-extralight font-meri cursor-help text-accent">
			<span
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
			I enjoy building products. i also write alot and some of it makes it to my blog on here.
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
