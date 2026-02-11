<script>
	import { faAngleRight, faClock } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { formatDate } from '$lib/js/utils.js';

	let { title, link, date, visual } = $props();
</script>

<div class="flex flex-col gap-1 py-3 group w-full">
	<div class="flex items-baseline gap-2 justify-between">
		<a
			href={link}
			class="text-sm font-bold text-orang dark:text-dark hover:underline underline-offset-2 transition-all"
		>
			{title}
		</a>
		<p class="text-[9px] font-mono opacity-30 whitespace-nowrap ml-4">
			{formatDate(date)}
		</p>
	</div>
</div>
