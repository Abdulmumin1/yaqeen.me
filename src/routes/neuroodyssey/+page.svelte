<script>
	import { scale, slide } from 'svelte/transition';
	import Fa from 'svelte-fa';
	import { faApple, faWindows, faLinux } from '@fortawesome/free-brands-svg-icons';
</script>

<div class="min-h-screen p-3" in:slide>
	<article class="flex w-full p-6 h-[80vh] gap-4 justify-between items-center flex-col md:flex-row">
		<aside class="max-w-md w-full h-full">
			<div
				class=" h-full p-4 w-full rounded-lg shadow-xl dark:shadow-lg dark:shadow-stone-700 flex flex-col justify-between items-center"
			>
				<div
					class="border p-2 border-orang dark:border-dark rounded-lg flex justify-between items-center w-full"
				>
					<p>HighScore: 24</p>
					<p><Fa /></p>
				</div>

				<p>Numbers</p>

				<button class="w-full bg-orang shadow dark:bg-dark p-2 rounded-lg">play</button>
			</div>
		</aside>
		<section class="gap-2">
			<h1 class="text-6xl">Neuro Odyssey</h1>
			<p class="text-lg">Excell in you thinking ability with curated brain exercises</p>
		</section>
	</article>
	<div class="border-2 border-dotted border-orang dark:border-dark my-8" />
	<div class="w-full px-4 flex flex-col justify-center items-center">
		<h3 class="text-3xl">Download</h3>

		<div class="flex justify-between text-xl py-5 flex-col max-w-lg md:flex-row">
			<div class="flex flex-col items-center shadow-lg p-4 rounded-md gap-4 dark:shadow-stone-800">
				<Fa icon={faWindows} class="text-4xl" />
				<p>For Windows</p>
				<button class="bg-orang dark:bg-dark p-2 rounded-md">Download </button>
			</div>

			<div class="flex flex-col items-center shadow-lg p-4 rounded-md gap-4 dark:shadow-stone-800">
				<Fa icon={faApple} class="text-4xl" />
				<p>For Mac</p>
				<button class="bg-orang dark:bg-dark p-2 rounded-md">Download </button>
			</div>

			<div class="flex flex-col items-center shadow-lg p-4 rounded-md gap-4 dark:shadow-stone-800">
				<Fa icon={faLinux} class="text-4xl" />
				<p>For Linux</p>
				<button class="bg-orang dark:bg-dark p-2 rounded-md">Download </button>
			</div>
		</div>
	</div>
</div>
