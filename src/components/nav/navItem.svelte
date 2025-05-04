<script>
	let { data } = $props();
</script>

<li class="cursor-pointer p-1 dark:border-dark rounded">
	<a href={data.href} class="font-visby_mid hover-animate md:hover:text-2xl">
		{data.name}
	</a>
</li>

<style>
	.hover-animate {
		transition: font-size 0.15s ease-in-out; /* Transition on font-size property */
	}
</style>
