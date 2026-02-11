<script>
	import Fa from 'svelte-fa';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	let { title, description, link } = $props();
</script>

<div
	class="bg-primarye-100 bg-surface-soft  border-primary first:rounded-t-2xl last:rounded-b-2xl p-6 w-full con"
>
	<div class="">
		<div class="flex justify-between items-center">
			<h4 class="text-xl md:text-2xl font-bold font-visby_mid">{title}</h4>
			<a class="text-stone-800 dark:text-text-main/70" href="https://github.com/{link}"
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
