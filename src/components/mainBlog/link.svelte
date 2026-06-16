<script>
	let { href, children } = $props();
</script>

<a class="text-accent hover:underline" {href} target="_blank">{@render children?.()}</a>
