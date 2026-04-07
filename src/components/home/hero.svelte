<script>
	import { getKbarState } from 'kbar-svelte-mini';
	let kbarState = getKbarState();

	// ASCII spinner frames
	const frames = ['✶', '✸', '✹', '✺', '✹', '✷'];
	let currentFrame = $state(0);

	// Rotate through frames
	setInterval(() => {
		currentFrame = (currentFrame + 1) % frames.length;
	}, 200);
</script>

<main class="flex flex-col justify-center px-6">
	<div class="space-y-1">
		<div class="flex items-center gap-1 font-mono text-text-muted">
			<span class="inline-block text-[13px] w-2">{frames[currentFrame]}</span>
			<span class="text-[10px]">Transmogrifying</span>
		</div>

		<div class="flex flex-col">
			<h1 class="text-base font-bold tracking-widest uppercase text-primary">Abdulmumin Yaqeen</h1>
		</div>

		<div class="text-xs leading-relaxed text-text-muted max-w-sm">
			Checkout <a
				href="https://owostack.com"
				target="_blank"
				class="text-primary underline decoration-primary/10 underline-offset-2 hover:decoration-primary"
				>owostack.com</a
			>.
		</div>

		<nav class="flex gap-4 pt-2">
			{#each ['about', 'blog', 'work'] as link}
				<a
					href="/{link}"
					class="text-[9px] font-mono text-text-muted hover:text-primary transition-colors"
				>
					/{link}
				</a>
			{/each}
		</nav>
	</div>
</main>
