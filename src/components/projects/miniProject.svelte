<script>
	import Fa from 'svelte-fa';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	export let title;
	export let description;
	export let link;
</script>

<div
	class="bg-orange-100 dark:bg-stone-900 dark:border-dark border-orang first:rounded-t-2xl last:rounded-b-2xl p-6 w-full con"
>
	<div class="">
		<div class="flex justify-between items-center">
			<h4 class="text-xl md:text-2xl font-bold font-visby_mid">{title}</h4>
			<a class="text-stone-800 dark:text-orange-200/70" href="https://github.com/{link}"
				><Fa icon={faGithub} /></a
			>
		</div>
		<div class="text-stone-800 dark:text-stone-500 text-sm">{link}</div>
	</div>
	<div>
		{description}
	</div>
</div>

<style>
	.con {
		display: flex;
		flex-direction: column;
		/* max-width: 600px; */
	}
</style>
