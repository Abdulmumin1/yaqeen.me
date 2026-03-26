<script>
	import SeriesEpisodes from '../../../../components/mainBlog/seriesEpisodes.svelte';
	import Seo from '$components/general/seo.svelte';
	import { siteOrigin } from '$lib/js/config.js';

	// console.log(data);
</script>

<svelte:head>
	<Seo
		title="Under the Hood Series | Abdulmumin Yaqeen"
		description="A series where Abdulmumin Yaqeen breaks down technical concepts and how they work under the hood."
		canonical={`${siteOrigin}/blog/series/uth`}
	/>
</svelte:head>

<div class="article flex flex-col gap-4">
	<h1>Under the Hood Series</h1>

	<p>
		Following my curiosity, every week I will try to demysify and share concepts that pique my
		interest, taking a closer look on how they work under the hood.
	</p>

	<h2>Episodes</h2>

	<SeriesEpisodes series="uth" highlight={1} />
</div>
