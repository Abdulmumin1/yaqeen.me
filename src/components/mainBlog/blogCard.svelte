<script>
	import { formatDate } from '$lib/js/utils.js';
	import {
		faArrowAltCircleRight,
		faArrowRightLong,
		faArrowTrendUp
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { fade, scale, slide } from 'svelte/transition';
	// import { slide } from 'svelte/transition';
	export let details;
	export let latest;
</script>

<div
	in:scale
	class="w-full min-w-[300px] space-y-3 border rounded-xl border-b-2 h-full p-5 bg-orange-100 dark:bg-stone-900 dark:text-orange-200 border-orang dark:border-dark transition-all duration-200 md:hover:scale-105"
>
	{#if latest}
		<div class="max-w-md flex flex-col gap-3">
			<a
				href={`blog/${details.slug}`}
				title={details.title}
				class="text-5xl lg:text-6xl hover:opacity-80 text-orang dark:text-dark max-w-md capitalize"
			>
				{details.title}</a
			>
			<p class="text-sm">{formatDate(details.date)}</p>

			<a
				href={`blog/${details.slug}`}
				class="flex gap-2 hover:gap-4 text-base transition-all duration-300 items-center"
				>Continue Reading <Fa icon={faArrowRightLong} /></a
			>
			{#if details?.visual}
				<div class="text-sm bg-orange-200 dark:bg-stone-800 rounded-3xl w-fit px-2">
					Interactive Blog
				</div>
			{/if}
		</div>
	{:else}
		<a
			href={`blog/${details.slug}`}
			title={details.title}
			class="text-2xl lg:text-3xl hover:opacity-80"
		>
			{details.title}</a
		>
		<p>{formatDate(details.date)}</p>
		{#if details?.visual}
			<div class="text-sm bg-orange-200 dark:bg-stone-800 rounded-3xl w-fit px-2">
				Interactive Blog
			</div>
		{/if}
	{/if}
	<!-- <p>{details.description}</p> -->
	<!-- <a href={`blog/${details.slug}`} class="py-2 flex items-center gap-3">
		Read more <Fa icon={faArrowTrendUp} /></a
	> -->
</div>
