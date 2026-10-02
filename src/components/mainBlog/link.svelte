<script>
	let { href, children } = $props();
</script>

<a class="link" {href} target="_blank" rel="noopener noreferrer">{@render children?.()}</a>
