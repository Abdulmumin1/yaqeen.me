<script>
	import Fa from 'svelte-fa';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	export let title;
	export let description;
	export let link;
</script>

<div
	class="bg-orange-100 border border-b-2 dark:bg-stone-900 dark:border-dark border-orang rounded-3xl p-6 w-full con"
>
	<div>
		<div class="flex justify-between items-center">
			<h4 class="text-xl md:text-2xl font-bold font-visby_mid">{title}</h4>
			<a href="https://github.com/{link}"><Fa icon={faGithub} /></a>
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
		max-width: 600px;
	}
</style>
