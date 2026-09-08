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

	<h1 class="sr-only">Abdulmumin Yaqeen — product builder and writer</h1>

	<p class="text-xl sm:text-2xl md:text-3xl font-visby leading-relaxed text-text-main text-balance">
		Hi, call me
		<span class="relative inline-block font-comic text-accent text-[1.08em]">
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
		</span>. I enjoy building products. I also write a lot, and some of it ends up here on my
		<a
			href={resolve('/blog')}
			class="text-text-main underline decoration-accent/45 underline-offset-4"
		>
			blog</a
		>. You can find me on
		{#each socials as social, index (social.name)}
			{#if index > 0}<span aria-hidden="true">, </span>{:else}{' '}{/if}
			<a
				href={social.href.startsWith('/') ? resolve(social.href) : social.href}
				class="font-mono text-[0.72em] tracking-wide text-accent/80 underline decoration-accent/30 underline-offset-4 transition-colors hover:text-accent"
			>
				{social.name}
			</a>
		{/each}.
	</p>
</div>
