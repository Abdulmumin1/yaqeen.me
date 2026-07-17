<script>
	import { highlight } from '@highlighters/svelte';
	import { resolve } from '$app/paths';
	import Guestbook from '$components/home/guestbook.svelte';

	const socials = [
		{ name: 'github', href: 'https://github.com/Abdulmumin1' },
		{ name: 'linkedin', href: 'https://linkedin.com/in/abdulmuminyqn' },
		{ name: 'twitter', href: 'https://twitter.com/abdulmuminyqn' },
		{ name: 'email', href: 'mailto:abdulmuminyqn@gmail.com' }
	];
</script>

<div class="relative max-w-xl">
	<Guestbook />

	<h1
		class="text-2xl sm:text-3xl md:text-5xl font-serif mb-5 leading-tight text-text-main md:whitespace-nowrap"
	>
		Hi, call me
		<span class="relative inline-block font-extralight font-meri text-accent">
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
				yaqeen
			</span>
		</span>
	</h1>

	<div class="text-base sm:text-lg md:text-xl font-visby text-text-muted leading-relaxed">
		<p class="text-balance">
			I enjoy building products. I also write a lot, and some of it ends up here on my blog.
		</p>
	</div>

	<div class="flex flex-wrap gap-x-6 gap-y-2 mt-5">
		{#each socials as social (social.name)}
			<a
				href={social.href.startsWith('/') ? resolve(social.href) : social.href}
				class="text-text-muted transition-colors text-base font-mono tracking-widest uppercase"
			>
				{social.name}
			</a>
		{/each}
	</div>
</div>
