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
		Hi, I'm <span class="text-accent italic">Abdulmumin Yaqeen</span>
	</h1>

	<div class="text-lg md:text-xl font-visby text-text-muted leading-relaxed space-y-4">
		<p>
			I build <span class="text-accent italic">stuff for AI</span>.
		</p>
		<p>
			Currently building <a href="https://owostack.com" class="text-text-main decoration-accent/30 underline underline-offset-4 hover:decoration-accent transition-colors">owostack.com</a> and <a href="/blog" class="text-text-main decoration-accent/30 underline underline-offset-4 hover:decoration-accent transition-colors">writing</a> without polish.
		</p>
		<p class="text-base opacity-60">
			Loyal to Apache 2.0.
		</p>
	</div>

	<div class="flex flex-wrap gap-x-6 gap-y-2 mt-12">
		{#each socials as social}
			<a href={social.href} class="text-accent hover:text-text-main transition-colors text-sm font-mono tracking-widest uppercase">
				{social.name}
			</a>
		{/each}
	</div>
</div>
