<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<!-- A post sits in the same column, and starts at the same height, as every other page. -->
<div class="page">
	{@render children?.()}
</div>
