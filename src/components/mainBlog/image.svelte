<script>
	import { faClose } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	/**
	 * @typedef {Object} Props
	 * @property {string} [src]
	 * @property {string} [alt]
	 */

	/** @type {Props} */
	let { src = '', alt = '' } = $props();

	let showModal = $state(false);

	function toggleModal() {
		showModal = !showModal;
	}
</script>

<!-- <div class="image-container"> -->

<!-- <img
		{src}
		{alt}
		onkeypress={toggleModal}
		tabindex="0"
		onclick={toggleModal}
		class="thumbnail rounded-md"
	/>
	{#if alt}
		<p class="caption">{alt}</p>
	{/if} -->

<!-- </div> -->


<span class="image-container">
	<img
		{src}
		{alt}
		onkeypress={toggleModal}
		tabindex="0"
		onclick={toggleModal}
		class="thumbnail rounded-md"
	/>
	{#if alt}
		<p class="caption">{alt}</p>
	{/if}
</span>


{#if showModal}
	<div class="modal">
		<button
			class="fixed top-[12px] p-2 flex items-center justify-center rounded-full text-2xl aspect-square right-[12px] bg-orang dark:bg-dark text-black"
			onclick={toggleModal}><Fa icon={faClose} /></button
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
		font-size: 13px;
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #111111c7;
		backdrop-filter: blur(9px);
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
