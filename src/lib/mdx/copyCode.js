// Pressing the corner of a code listing copies it. The corner is put there when a
// post is compiled (src/lib/codeHighlighter.mjs); this listens for it on a whole
// post at once.

/**
 * @param {HTMLElement} node - Whatever holds the post.
 * @returns {() => void} Call to stop listening.
 */
export function copyCode(node) {
	if (!node) return () => {};
	const timers = new WeakMap();

	async function onClick(event) {
		const corner = event.target.closest?.('.code-copy');
		if (!corner || !node.contains(corner)) return;
		const listing = corner.closest('.code')?.querySelector('pre');
		if (!listing) return;
		try {
			await navigator.clipboard.writeText(listing.innerText.replace(/\n$/, ''));
		} catch {
			return;
		}
		corner.classList.add('copied');
		clearTimeout(timers.get(corner));
		timers.set(
			corner,
			setTimeout(() => corner.classList.remove('copied'), 1600)
		);
	}

	node.addEventListener('click', onClick);
	return () => node.removeEventListener('click', onClick);
}
