<script>
	let { href, children } = $props();
</script>

<a class="text-orange-500 hover:underline" {href} target="_blank">{@render children?.()}</a>
