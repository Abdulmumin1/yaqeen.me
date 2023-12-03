<script>
	import Fa from 'svelte-fa';
	import { faCopy, faRightLong } from '@fortawesome/free-solid-svg-icons';
</script>

<div class="parent w-full h-full">
	<div
		class="sticky top-[120px] bg-orange-100 divide-y divide-orang dark:divide-dark dark:bg-stone-900 p-4 rounded-xl m-4 flex gap-4 flex-col"
	>
		<div class="flex flex-col gap-2">
			<p class="font-semibold">Signup for DevCanvas</p>
			<p class="text-sm">An online HTML/CSS/JS Editor with fast and instant previews!</p>
			<a
				href="https://snippet-bice.vercel.app/play/try"
				target="_blank"
				class="flex text-sm items-center gap-2 bg-orang dark:bg-dark dark:text-stone-950 p-2 rounded-xl w-fit"
				>Try DevCanvas <Fa icon={faRightLong} /></a
			>
		</div>
		<div class="flex flex-col gap-2">
			<p class="font-semibold">SleekScroll</p>
			<p class="text-sm">Make Ugly Chromium scrollbars look cool!</p>
			<a
				href="https://github.com/Abdulmumin1/sleek-scroll"
				target="_blank"
				class="flex text-sm items-center gap-2 bg-orang dark:bg-dark dark:text-stone-950 p-2 rounded-xl w-fit"
				>Get Browser Extension <Fa icon={faRightLong} /></a
			>
		</div>
	</div>
</div>

<style>
	.parent {
		position: relative; /* Set the parent container as a positioning context */
		/* Other styles for the parent container */
	}

	.fixed-item {
		position: fixed; /* Fix the item in place */
		top: 30%; /* Adjust top position */
		/* Other styles for the fixed item */
	}
</style>
