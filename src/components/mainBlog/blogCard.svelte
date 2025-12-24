<script>
	import { formatDate } from '$lib/js/utils.js';
	import {
		faArrowAltCircleRight,
		faArrowRightLong,
		faArrowTrendUp
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { fade, scale, slide } from 'svelte/transition';

	/**
	 * @typedef {Object} Props
	 * @property {any} details - import { slide } from 'svelte/transition';
	 * @property {any} latest
	 */

	/** @type {Props} */
	let { details, latest } = $props();
</script>

<div
	class="w-full min-w-[300px] space-y-3 h-full p-5 bg-orange-50 dark:bg-stone-950 dark:text-orange-200"
>
	{#if latest}
		<div class=" flex flex-col gap-3 w-full">
			<a
				href={`/blog/${details.slug}`}
				title={details.title}
				class="text-5xl lg:text-6xl hover:text-orange-600 dark:hover:text-orange-300 text-orang dark:text-dark text-balance w-full capitalize"
			>
				{details.title}</a
			>
			<p class="text-sm">{formatDate(details.date)}</p>

			<a
				href={`/blog/${details.slug}`}
				class="flex gap-2 hover:gap-4 text-base transition-all duration-300 items-center"
				>Continue Reading <Fa icon={faArrowRightLong} /></a
			>
			{#if details?.label}
				<div class="text-sm bg-orange-200 dark:bg-stone-800 rounded-3xl w-fit px-2">
					{@html details.label}
				</div>
			{/if}
		</div>
	{:else}
		<a
			href={`/blog/${details.slug}`}
			title={details.title}
			class="text-2xl lg:text-3xl hover:text-orange-600 dark:hover:text-orange-300"
		>
			{details.title}</a
		>
		<p>{formatDate(details.date)}</p>
		{#if details?.label}
			<div class="text-sm bg-orange-200 dark:bg-stone-800 rounded-3xl w-fit px-2">
				{@html details.label}
			</div>
		{/if}
	{/if}
	<!-- <p>{details.description}</p> -->
	<!-- <a href={`blog/${details.slug}`} class="py-2 flex items-center gap-3">
		Read more <Fa icon={faArrowTrendUp} /></a
	> -->
</div>
