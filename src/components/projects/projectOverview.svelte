<script>
	import ImageCarousel from './imageCarousel.svelte';

	export let details;
</script>

<div class="snap-mandatory h-[600px] w-[100vw] p-2 md:p-12">
	<div class=" h-full border-orang dark:border-dark rounded-xl flex items-center justify-center">
		<div class="flex flex-col md:flex-row gap-10 items-start md:items-center justify-center p-12">
			<ImageCarousel imageList={['/dummy.png', '/image.png', '/habitud1.png', '/habitud2.png']} />
			<div class="details max-w-md min-w-[300px]">
				<h1 class="text-4xl font-bold font-visby_bold">
					<a href={details.links.page}>{details.name}</a>
				</h1>
				<p>{details.description}</p>
			</div>
		</div>
	</div>
</div>
