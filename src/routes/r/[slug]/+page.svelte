<script>
	export let data;
</script>

<div class="w-full flex justify-center py-12">
	<main class="max-w-[800px] text-xl px-4">
		<h1
			class="text-5xl font-bold pb-3 mb-3 font-visby_bold border-b border-black dark:border-[#444] text-center"
		>
			{@html data.title}
		</h1>
		{@html data.content}
	</main>
</div>

<style>
</style>
