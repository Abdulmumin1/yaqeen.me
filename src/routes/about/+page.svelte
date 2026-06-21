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

<div class="max-w-2xl mx-auto px-6 py-12 md:py-24 flex flex-col gap-12">
	<div class="flex flex-col gap-8">
		<h1 class="text-3xl font-serif text-text-main border-b border-border/40 pb-2 w-fit pr-8">
			About
		</h1>

		<div class="flex items-center gap-4">
			<button
				type="button"
				class="profile-image group relative block shrink-0"
				onclick={handleInteraction}
				onmouseenter={handleMouseEnter}
				onmouseleave={handleMouseLeave}
				aria-label="Profile image"
			>
				<span
					class="profile-frame overflow-hidden rounded-xl border border-border/40 block shadow-sm group-hover:border-accent transition-colors"
				>
					<img
						src={me}
						alt="Abdulmumin Yaqeen"
						class="w-24 h-24 object-cover grayscale hover:grayscale-0 transition-all duration-500 dark:brightness-90"
					/>
				</span>
				<span
					class="profile-note pointer-events-none absolute left-0 sm:left-1/2 top-full mt-3 whitespace-nowrap rounded-full border border-accent/10 bg-surface px-3 py-1 text-[9px] font-mono uppercase tracking-[0.2em] text-accent shadow-sm transition-all duration-300 {showTooltip
						? 'opacity-100 translate-y-0'
						: 'opacity-0 -translate-y-2'}"
				>
					{profileNote}
				</span>
			</button>
		</div>
	</div>

	<div class="flex flex-col gap-6 text-lg font-visby text-text-muted leading-relaxed max-w-xl">
		<p>I'm <span class="text-text-main font-medium">Abdulmumin Yaqeen</span>.</p>
		<p>I do stuff, mostly a developer.</p>
		<p>
			Used to run a <a
				class="text-text-main decoration-accent/30 underline underline-offset-4 hover:decoration-accent transition-colors"
				href="https://www.youtube.com/@abdulmuminyqn">YouTube channel</a
			> a few years ago.
		</p>
		<p class="text-base opacity-60">loyal to Apache 2.0 declaration :)</p>
	</div>

	<div class="flex flex-col gap-8 pt-4">
		<div class="space-y-4">
			<h2 class="text-2xl font-serif text-text-main">Defaults</h2>
			<ul class="flex flex-col border-t border-border/40">
				<li class="py-4 text-base text-text-muted border-b border-border/10">
					Usually building, writing, sketching, or taking apart something that was already working.
				</li>
				<li class="py-4 text-base text-text-muted border-b border-border/10">
					Recurring themes: dev tools, security, interfaces, experiments, and curiosity with bad
					time management.
				</li>
				<li class="py-4 text-base italic text-accent opacity-80">and VERY PICKY, aesthetically.</li>
			</ul>
		</div>
	</div>
</div>
