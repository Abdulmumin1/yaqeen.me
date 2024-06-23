<script>
	import { faClose } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let src = '';
	export let alt = '';

	let showModal = false;

	function toggleModal() {
		showModal = !showModal;
	}
</script>

<div class="image-container">
	<img
		{src}
		{alt}
		on:keypress={toggleModal}
		tabindex="0"
		on:click={toggleModal}
		class="thumbnail"
	/>
	{#if alt}
		<p class="caption">{alt}</p>
	{/if}
</div>

{#if showModal}
	<div class="modal">
		<button
			class="fixed top-[12px] p-3 flex items-center justify-center rounded-full text-2xl aspect-square right-[12px] bg-orang dark:bg-dark text-black"
			on:click={toggleModal}><Fa icon={faClose} /></button
		>
		<div class="modal-content">
			<img {src} {alt} />
			{#if alt}
				<p class="modal-caption">{alt}</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	.image-container {
		display: inline-block;
		cursor: pointer;
	}

	.thumbnail {
		max-width: 100%;
		height: auto;
	}

	.caption {
		text-align: center;
		font-style: italic;
		margin-top: 0.5em;
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(8px);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal-content {
		max-width: 90%;
		max-height: 90%;
	}

	.modal-content img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.modal-caption {
		color: white;
		text-align: center;
		margin-top: 1em;
	}
</style>
