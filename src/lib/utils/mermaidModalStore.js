import { browser } from '$app/environment';
import { writable } from 'svelte/store';

/**
 * Store holding svg HTML string of the currently opened diagram in modal (or null if closed)
 */
export const activeMermaidModalSvg = writable(null);

export function openMermaidModal(svgHtml) {
	activeMermaidModalSvg.set(svgHtml);
}

export function closeMermaidModal() {
	activeMermaidModalSvg.set(null);
}
