<script>
	import { faAngleRight, faClock } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let title;
	export let link;
</script>

<div class="flex flex-col border-b-2 border-orang dark:border-dark">
	<p class="text-lg lg:text-2xl font-visby_mid">
		{title}
	</p>

	<div class="flex items-center w-fit space-x-2 p-1 rounded-xl hover_link">
		<a href={link} class="">Read More </a>
		<Fa icon={faAngleRight} />
	</div>
</div>
