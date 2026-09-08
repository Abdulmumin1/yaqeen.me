<script>
	import { faClose } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { activeMermaidModalSvg, closeMermaidModal } from '$lib/utils/mermaidModalStore.js';

	let svgContent = $derived($activeMermaidModalSvg);

	function handleKeydown(e) {
		if (e.key === 'Escape' && svgContent) {
			closeMermaidModal();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if svgContent}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<div
		class="mermaid-modal"
		role="dialog"
		tabindex="-1"
		aria-modal="true"
		aria-label="Expanded diagram"
		onclick={closeMermaidModal}
	>
		<button
			type="button"
			class="close-button"
			onclick={(e) => {
				e.stopPropagation();
				closeMermaidModal();
			}}
			aria-label="Close diagram modal"
		>
			<Fa icon={faClose} />
		</button>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="mermaid-modal-viewport" onclick={(e) => e.stopPropagation()}>
			<div class="mermaid-modal-svg-wrap">
				{@html svgContent}
			</div>
		</div>
	</div>
{/if}

<style>
	.mermaid-modal {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(10, 10, 10, 0.9);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		cursor: zoom-out;
		padding: 3rem 2rem;
		box-sizing: border-box;
	}

	.close-button {
		position: fixed;
		top: 24px;
		right: 24px;
		z-index: 1010;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 9999px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		background-color: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.85);
		font-size: 1.2rem;
		cursor: pointer;
		outline: none;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		transition: background-color 0.15s, color 0.15s;
	}

	.close-button:hover {
		background-color: rgba(255, 255, 255, 0.18);
		color: #ffffff;
		border-color: rgba(255, 255, 255, 0.35);
	}

	.mermaid-modal-viewport {
		width: 100%;
		max-width: 95vw;
		height: 100%;
		max-height: 90vh;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: default;
		overflow: auto;
		overscroll-behavior: contain;
	}

	.mermaid-modal-svg-wrap {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.mermaid-modal-svg-wrap :global(svg) {
		width: 100% !important;
		max-width: min(92vw, 1400px) !important;
		height: auto !important;
		max-height: 85vh !important;
		display: block;
		margin: auto;
		filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.35));
	}
</style>
