<script>
	import { resolve } from '$app/paths';
	import Fa from 'svelte-fa';
	import { faLongArrowRight, faThumbTack } from '@fortawesome/free-solid-svg-icons';

	let { title, link, date, visual, external = false, slug, pinned = false } = $props();

	function formatDisplayDate(dateStr) {
		const d = new Date(dateStr);
		const month = d.toLocaleString('default', { month: 'short' });
		const day = d.getDate();
		const currentYear = new Date().getFullYear();
		if (d.getFullYear() < currentYear) {
			const year = d.getFullYear().toString().slice(-2);
			return `${month} ${day} '${year}`;
		}
		return `${month} ${day}`;
	}
</script>

<div class="relative py-4 group">
	<div class="flex items-baseline gap-3 md:block">
		<!-- Date positioned in the gutter for md+ screens -->
		<div
			class="w-[4.5rem] shrink-0 flex items-center gap-1.5 whitespace-nowrap md:absolute md:-left-32 md:w-24 md:justify-end text-xs md:text-sm font-serif text-text-muted/60 italic mb-0 md:mb-0 date-gutter"
		>
			<div class="w-3.5 shrink-0 flex items-center justify-center">
				{#if pinned}
					<div class="text-accent/60 flex items-center" aria-hidden="true">
						<Fa icon={faThumbTack} class="size-2.5 rotate-45" />
					</div>
					<span class="sr-only">Pinned post</span>
				{/if}
			</div>
			<span>{formatDisplayDate(date)}</span>
		</div>

	<div class="flex items-baseline gap-2 md:block">
		{#if external}
			<a
				href={link}
				target="_blank"
				rel="noopener noreferrer"
				class="text-[17px] md:text-xl font-serif text-text-main hover:text-accent decoration-border/40 underline-offset-4 hover:decoration-accent transition-all"
			>
				{title}<span class="inline-block align-middle ml-1 italic text-accent opacity-60"
					><Fa icon={faLongArrowRight} class="-rotate-45" /></span
				>
			</a>
		{:else}
			<a
				href={resolve('/blog/[slug]', { slug })}
				class="text-[17px] md:text-xl font-serif text-text-main hover:text-accent decoration-border/40 underline-offset-4 hover:decoration-accent transition-all"
			>
				{title}
			</a>
		{/if}
	</div>
	</div>
</div>

<style>
	@media (min-width: 768px) {
		.date-gutter {
			top: 21px;
		}
	}
</style>
