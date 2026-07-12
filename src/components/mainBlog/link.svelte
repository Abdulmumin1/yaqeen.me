<script>
	let { href, children } = $props();
</script>

<a class="text-accent hover:underline" {href} target="_blank" rel="noopener noreferrer"
	>{@render children?.()}</a
>
