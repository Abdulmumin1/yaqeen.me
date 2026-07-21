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

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function handleKeydown(e) {
		if (e.key === 'Escape' && showModal) {
			closeModal();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<span class="image-container">
	<button
		type="button"
		class="thumbnail-button"
		onclick={openModal}
		aria-label={alt ? `Expand image: ${alt}` : 'Expand image'}
	>
		<img {src} {alt} class="thumbnail rounded-lg" />
	</button>
	{#if alt}
		<span class="caption">{alt}</span>
	{/if}
</span>

{#if showModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-label={alt ? `Expanded image: ${alt}` : 'Expanded image'}
		onclick={closeModal}
	>
		<button
			type="button"
			class="close-button"
			onclick={(e) => {
				e.stopPropagation();
				closeModal();
			}}
			aria-label="Close expanded image"
		>
			<Fa icon={faClose} />
		</button>
		
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div 
			class="modal-content" 
			onclick={(e) => e.stopPropagation()}
		>
			<img {src} {alt} class="expanded-image" />
			{#if alt}
				<span class="modal-caption">{alt}</span>
			{/if}
		</div>
	</div>
{/if}

<style>
	.image-container {
		display: inline-block;
		width: 100%;
	}

	.thumbnail-button {
		display: block;
		cursor: zoom-in;
		width: 100%;
		border: none;
		background: none;
		padding: 0;
		outline: none;
		border-radius: var(--radius-xl, 0.75rem);
		overflow: hidden;
	}

	.thumbnail {
		width: 100%;
		height: auto;
		display: block;
		border: 1px solid var(--color-border);
	}

	.caption {
		display: block;
		text-align: center;
		font-style: italic;
		margin-top: 0.75em;
		font-size: 13px;
		color: var(--color-text-muted);
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(10, 10, 10, 0.85);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		cursor: zoom-out;
		padding: 2rem;
	}

	.close-button {
		position: fixed;
		top: 24px;
		right: 24px;
		z-index: 1010;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: 9999px;
		border: 1px solid rgba(255, 255, 255, 0.15);
		background-color: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.8);
		font-size: 1.25rem;
		cursor: pointer;
		outline: none;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	.close-button:hover {
		background-color: rgba(255, 255, 255, 0.14);
		color: #ffffff;
		border-color: rgba(255, 255, 255, 0.25);
	}

	.modal-content {
		max-width: min(95%, 1200px);
		max-height: 85vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: default;
	}

	.expanded-image {
		max-width: 100%;
		max-height: 80vh;
		object-fit: contain;
		border-radius: var(--radius-2xl, 1rem);
		border: 1px solid rgba(255, 255, 255, 0.15);
	}

	.modal-caption {
		display: block;
		color: rgba(255, 255, 255, 0.8);
		text-align: center;
		margin-top: 1.25rem;
		font-size: 14px;
		font-style: italic;
		letter-spacing: 0.03em;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
	}
</style>