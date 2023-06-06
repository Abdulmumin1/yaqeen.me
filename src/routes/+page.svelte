<script>
	import BlogSection from '../components/blogHome/blogSection.svelte';
	import Hero from '../components/home/hero.svelte';
	import ProSection from '../components/projects/proSection.svelte';

	import me from '$lib/images/me.jpg';
</script>

<div class="snap-proximity snap-y flex flex-col">
	<div class="lg:h-[580px] h-[480px] flex flex-col justify-center items-center snap-center">
		<div
			class="w-[90%] h-[90%] flex p-2 relative rounded-t-2xl lg:border-x-2 lg:border-t-2 border-black dark:border-[#333] items-center justify-center"
		>
			<!-- <img src="{me}" alt="abdulmumin yaqeen " class="h-full border-2 border-black rounded-3xl"> -->
			<!-- <Nav/> -->

			<Hero />
		</div>
	</div>

	<ProSection />
	<BlogSection />
</div>
