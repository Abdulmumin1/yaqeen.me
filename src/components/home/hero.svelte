<script>
	// Social icons mapping (simplified)
	const socials = [
		{ name: 'github', icon: 'Github', href: '#' },
		{ name: 'linkedin', icon: 'Linkedin', href: '#' },
		{ name: 'twitter', icon: 'Twitter', href: '#' },
		{ name: 'email', icon: 'Mail', href: '#' },
		{ name: 'rss', icon: 'Rss', href: '#' }
	];
</script>

<div class="py-12 md:py-20 max-w-xl">
	<div class="mb-8">
		<img src="/favicon.png" alt="Icon" class="w-10 h-10 grayscale opacity-80" />
	</div>

	<h1 class="text-3xl md:text-5xl font-serif mb-6 leading-tight">
		Hi, I'm <span class="text-accent italic">Abdulmumin Yaqeen</span>
	</h1>

	<div class="text-lg md:text-xl font-visby text-stone-700 leading-relaxed space-y-4">
		<p>
			I build <span class="text-accent italic">stuff for AI</span>.
		</p>
		<p>
			Currently building <a href="https://owostack.com" class="text-stone-900 decoration-accent/30 underline underline-offset-4 hover:decoration-accent transition-colors">owostack.com</a> and <a href="/blog" class="text-stone-900 decoration-accent/30 underline underline-offset-4 hover:decoration-accent transition-colors">writing</a> without polish.
		</p>
		<p class="text-base opacity-60">
			Loyal to Apache 2.0.
		</p>
	</div>

	<div class="flex gap-5 mt-10 text-accent opacity-80">
		<!-- Simplified icons for now, we can use Lucide or Heroicons later -->
		{#each socials as social}
			<a href={social.href} class="hover:scale-110 transition-transform">
				<span class="capitalize text-sm font-mono tracking-widest">{social.name}</span>
			</a>
		{/each}
	</div>
</div>
