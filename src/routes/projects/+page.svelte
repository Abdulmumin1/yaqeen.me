<script>
	import MiniSection from '../../components/projects/miniSection.svelte';
	import BigSection from '../../components/projects/bigSection.svelte';
	import Seo from '../../components/general/seo.svelte';
</script>

<svelte:head>
	<Seo title="Projects" description="A collection of the projects i've completed over the years" />
</svelte:head>

<div class="grid place-items-center w-full p-4">
	<div class="flex gap-4 flex-col max-w-[1200px] w-full relative">
		<BigSection />
		<MiniSection />
	</div>
</div>

<style>
	::-webkit-scrollbar {
		height: 0;
		width: 0;
	}

	.scroll-container {
		scroll-snap-type: y mandatory; /* Define vertical scroll snap behavior */
	}

	.scroll-item {
		scroll-snap-align: start;
		transition: transform 0.3s ease;
	}
</style>
