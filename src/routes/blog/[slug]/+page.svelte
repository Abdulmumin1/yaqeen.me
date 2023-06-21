<script>
	export let data;
</script>

<div class="w-full flex justify-center py-12">
	<div class="max-w-[800px] lg:text-xl px-4">
		<h1 class="text-4xl lg:text-5xl font-bold p-6 mb-3 font-visby_bold text-center">
			{@html data.title}
		</h1>
		{@html data.content}
	</div>
</div>

<style>
</style>
