<script>
	const socials = [
		{ name: 'github', href: 'https://github.com/Abdulmumin1' },
		{ name: 'linkedin', href: 'https://linkedin.com/in/abdulmuminyqn' },
		{ name: 'twitter', href: 'https://twitter.com/abdulmuminyqn' },
		{ name: 'email', href: 'mailto:abdulmuminyqn@gmail.com' },
		{ name: 'rss', href: '/rss.xml' }
	];
</script>

<div class="py-12 md:py-20 max-w-xl">
	<div class="mb-8">
		<img src="/favicon.png" alt="Icon" class="w-10 h-10 grayscale opacity-80 dark:invert" />
	</div>

	<h1 class="text-3xl md:text-5xl font-serif mb-8 leading-tight text-text-main whitespace-nowrap">
		Hi, i'm <span class="text-accent font-extralight">Abdulmumin Yaqeen</span>
	</h1>

	<div class="text-lg md:text-xl font-visby text-text-muted leading-relaxed space-y-4">
		<p>
			I love building <span class="text-accent italic">products</span>, and contributing to
			<span class="text-accent italic">open source</span>. also share my
			<a href="/blog" class="text-accent italic">thoughts</a> on here without much polish.
		</p>
	</div>

	<div class="flex flex-wrap gap-x-6 gap-y-2 mt-12">
		{#each socials as social}
			<a
				href={social.href}
				class="text-accent hover:text-text-main transition-colors text-sm font-mono tracking-widest uppercase"
			>
				{social.name}
			</a>
		{/each}
	</div>
</div>
