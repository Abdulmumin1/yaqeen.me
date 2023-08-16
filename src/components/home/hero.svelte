<script>
	import Fa from 'svelte-fa';
	import { faLongArrowRight } from '@fortawesome/free-solid-svg-icons';
</script>

<main class="lg:h-[580px] h-[480px] flex flex-col justify-center items-center snap-center">
	<div
		class="w-[90%] h-[90%] flex p-2 relative rounded-t-2xl lg:border-x-2 lg:border-t-2 border-orang dark:border-dark items-center justify-center"
	>
		<!-- <img src="{me}" alt="abdulmumin yaqeen " class="h-full border-2 border-orang rounded-3xl"> -->
		<!-- <Nav/> -->

		<div class="text-center md:p-3 w-full flex items-center justify-center flex-col gap-2">
			<p
				class="lg:text-6xl text-4xl text-center font-visby_bold font-bold text-orang dark:text-dark"
			>
				I'm Abdulmumin
			</p>
			<p>Technical writer & Product engineer</p>
			<div
				class="flex gap-2 border-b-2 items-center rounded-2xl border py-1 px-3 cursor-pointer border-orang dark:border-dark transition-transform duration-200 transform hover:scale-105 hover:font-bold"
			>
				<a href="/about">Long Story</a>
				<Fa icon={faLongArrowRight} />
			</div>
		</div>
	</div>
</main>
