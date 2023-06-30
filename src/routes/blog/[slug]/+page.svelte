<script>
	export let data;
	import { formatDate } from '$lib/js/utils.js';
	import Fa from 'svelte-fa';
	import { faLinkedin, faReddit, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
	import { faCopy } from '@fortawesome/free-solid-svg-icons';
</script>

<svelte:head>
	<title>{data.meta.title}</title>
</svelte:head>
<article class="mx-auto flex flex-col gap-4">
	<hgroup class="text-center p-6">
		<h1 class="text-5xl">{data.meta.title}</h1>
		<!-- <p>Published at {formatDate(data.meta.date)}</p> -->
	</hgroup>
	<div class="flex gap-3">
		{#each data.meta.categories as tag}
			<span class="px-3 py-1 text-black rounded-full bg-orang dark:bg-dark">&num;{tag}</span>
		{/each}
	</div>

	<div class="space-y-6">
		<svelte:component this={data.content} />
	</div>
	<div class="w-full flex items-center justify-center p-3">
		<div
			class="w-full flex justify-between max-w-md items-center border border-b-2 rounded-lg border-orang dark:border-dark p-4"
		>
			<span>Love it? Share it!</span>
			<div class="flex space-x-3 items-center justify-center">
				<span><Fa icon={faCopy} /></span>
				<span><Fa icon={faTwitter} /></span>
				<span><Fa icon={faLinkedin} /></span>
				<span><Fa icon={faWhatsapp} /></span>
				<span><Fa icon={faReddit} /></span>
			</div>
		</div>
	</div>
</article>
