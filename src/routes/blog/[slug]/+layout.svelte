<script>
	import { fade, scale, slide } from 'svelte/transition';
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<div class="w-full flex justify-center py-12 mt-20">
	<section class="max-w-[1200px] w-full lg:text-xl px-4 md:p-12">
		{@render children?.()}
	</section>
</div>
