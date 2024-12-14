<script>
	import Fa from 'svelte-fa';
	import { faCopy, faRightLong } from '@fortawesome/free-solid-svg-icons';
</script>

<div class="parent w-full h-full">
	<div
		class="sticky top-[120px] bg-orange-100 divide-y divide-orang dark:divide-dark dark:bg-stone-900 p-4 rounded-xl m-4 flex gap-4 flex-col"
	>
		<div class="flex flex-col gap-2">
			<p class="font-semibold">Littlestats</p>
			<p class="text-sm">Analytics tool the cost a fixed $4/month</p>
			<a
				href="https://littlestats.click"
				target="_blank"
				class="flex text-sm items-center gap-2 bg-orange-300 border border-orang dark:border-dark dark:bg-stone-950 p-2 justify-center rounded-xl w-fit"
				>Start for free <Fa icon={faRightLong} /></a
			>
		</div>
		<div class="flex flex-col gap-2">
			<p class="font-semibold">Signup for DevCanvas</p>
			<p class="text-sm">An online HTML/CSS/JS Editor with fast and instant previews!</p>
			<a
				href="https://devcanvas.art/play/try"
				target="_blank"
				class="flex text-sm items-center gap-2 bg-orange-300 border border-orang dark:border-dark dark:bg-stone-950 p-2 justify-center rounded-xl w-fit"
				>Try DevCanvas <Fa icon={faRightLong} /></a
			>
		</div>
		<div class="flex flex-col gap-2">
			<p class="font-semibold">Get CommentRig</p>
			<p class="text-sm">Get the best modern comment management for your website.</p>
			<a
				href="https://www.commentrig.com"
				target="_blank"
				class="flex text-sm items-center gap-2 bg-orange-300 border border-orang dark:border-dark dark:bg-stone-950 p-2 justify-center rounded-xl w-fit"
				>Get Commentrig <Fa icon={faRightLong} /></a
			>
		</div>
		<!-- <div class="flex flex-col gap-2">
			<p class="font-semibold">SleekScroll</p>
			<p class="text-sm">Make Ugly Chromium scrollbars look cool!</p>
			<a
				href="https://github.com/Abdulmumin1/sleek-scroll"
				target="_blank"
				class="flex text-sm items-center gap-2 bg-orange-300 border border-orang dark:border-dark dark:bg-stone-950 p-2 rounded-xl w-fit"
				>Get Browser Extension <Fa icon={faRightLong} /></a
			>
		</div> -->
		<!-- <div class="flex flex-col gap-2">
			<p class="font-semibold">Kbar-svelte-mini</p>
			<p class="text-sm">Setup cmd+k/ctrl+k for your svelte app with breeze 🌬️</p>
			<a
				href="https://www.npmjs.com/package/kbar-svelte-mini"
				target="_blank"
				class="flex text-sm items-center gap-2 bg-orange-300 border border-orang justify-center dark:border-dark dark:bg-stone-950 p-2 rounded-xl w-fit"
				>Get npm package <Fa icon={faRightLong} /></a
			>
		</div> -->
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
