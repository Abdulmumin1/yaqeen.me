<script>
	import { fade, scale, slide } from 'svelte/transition';
</script>

<div class="w-full flex justify-center py-12 mt-20">
	<section class="max-w-[1200px] w-full lg:text-xl px-4">
		<slot />
	</section>
</div>
