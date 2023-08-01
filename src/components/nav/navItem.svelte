<script>
	export let data;
</script>

<li class="cursor-pointer p-1 dark:border-dark rounded">
	<a href={data.href} class="font-visby_mid hover-animate">
		{data.name}
	</a>
</li>

<style>
	.hover-animate {
		font-size: 16px; /* Starting font size */
		transition: font-size 0.15s ease-in-out; /* Transition on font-size property */
	}

	.hover-animate:hover {
		font-size: 24px; /* Ending font size on hover */
	}
</style>
