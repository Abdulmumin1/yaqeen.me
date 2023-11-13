<script>
	export let imageList;
</script>

<div class="flex gap-4 items-center justify-center flex-col">
	<div class="w-full h-full max-w-4xl">
		<img src={imageList[0]} alt="" class="object-contain rounded-3xl" />
	</div>
	<div class="w-80 flex items-center">
		{#each imageList as img}
			<div class="h-full w-full overflow-hidden rounded-lg">
				<img src={img} alt="" class="object-contain rounded-lg" style="aspect-ratio: 16/9;" />
			</div>
		{/each}
	</div>
</div>
