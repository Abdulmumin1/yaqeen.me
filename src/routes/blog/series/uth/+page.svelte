<script>
	import SeriesEpisodes from '../../../../components/mainBlog/seriesEpisodes.svelte';

	// console.log(data);
</script>

<div class="article flex flex-col gap-4">
	<h1>Under the Hood Series</h1>

	<p>
		Following my curiosity, every week I will try to demysify and share concepts that pique my
		interest, taking a closer look on how they work under the hood.
	</p>

	<h2>Episodes</h2>

	<SeriesEpisodes series="uth" highlight={1} />
</div>
