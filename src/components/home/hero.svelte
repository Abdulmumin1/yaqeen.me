<script>
	import Fa from 'svelte-fa';
	import { faLongArrowRight } from '@fortawesome/free-solid-svg-icons';
	import { getKbarState } from 'kbar-svelte-mini';

	let kbarState = getKbarState();

	function toggleKbar() {
		$kbarState = !$kbarState;
	}
</script>

<main class="lg:h-[500px] h-[480px] flex flex-col justify-center items-center snap-center">
	<div
		class="w-[90%] h-[90%] flex p-2 relative rounded-2xl border-orang dark:border-dark items-center justify-center"
	>
		<!-- <img src="{me}" alt="abdulmumin yaqeen " class="h-full border-2 border-orang rounded-3xl"> -->
		<!-- <Nav/> -->
		<div class="text-center md:p-3 w-full flex items-center justify-center flex-col gap-2">
			<div
				class="bg-orange-200 dark:bg-stone-800 dark:text-orange-300 p-1 px-2 rounded-full text-black text-sm"
			>
				<a href="https://thirdpen.app/read" target="_blank">
					 Introducting Thirdpen Read {" "}<span class="">&rAarr;</span> </a
				>
			</div>
			<p
				class=" md:text-6xl text-4xl text-center font-visby_bold font-bold text-orang dark:text-dark"
			>
				I'm Abdulmumin
			</p>
			<p>
				FullStack & Toolings engineer. <br />Currently building
				<a href="https://thirdpen.app" target="_blank" class="text-orang dark:text-dark"
					>thirdpen.app</a
				>
			</p>
			<div
				class="flex gap-2 border-b-2 items-center rounded-2xl border py-1 px-3 cursor-pointer border-orang dark:border-dark transition-transform duration-200 transform hover:scale-105 hover:font-bold"
			>
				<a href="/about">About me</a>
				<Fa icon={faLongArrowRight} />
			</div>
		</div>
	</div>
</main>
