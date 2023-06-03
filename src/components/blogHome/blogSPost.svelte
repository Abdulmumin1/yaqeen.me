<script>
	import { faAngleRight, faClock } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let title;
</script>

<div class="flex flex-col">
	<p class="text-lg lg:text-2xl">
		{title}
	</p>
	<div class="text-gray-700 flex items-center space-x-2">
		<Fa icon={faClock} />
		<p>Jan, 2023</p>
	</div>
	<div class="flex items-center w-fit space-x-2 p-1 rounded-xl">
		<a href="#" class="">Read More </a>
		<Fa icon={faAngleRight} />
	</div>
</div>
