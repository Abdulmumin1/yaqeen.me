<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
	// export let;
</script>

<pre>
	copy this code black
	{@render children?.()}
</pre>
