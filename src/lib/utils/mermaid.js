import { browser } from '$app/environment';

export function renderMermaid(node) {
	if (!browser || !node) return () => {};

	let frame;
	let isDestroyed = false;

	const run = async () => {
		if (isDestroyed) return;

		const nodes = Array.from(node.querySelectorAll('.mermaid:not([data-processed="true"])'));
		if (nodes.length === 0) return;
		try {
			const { default: mermaid } = await import('mermaid');
			if (isDestroyed) return;

			mermaid.initialize({
				startOnLoad: false,
				theme: 'dark',
				securityLevel: 'loose',
				suppressErrors: true
			});
			await mermaid.run({ nodes });
		} catch (e) {
			console.error('Mermaid rendering failed', e);
		}
	};

	frame = requestAnimationFrame(run);

	return () => {
		isDestroyed = true;
		cancelAnimationFrame(frame);
	};
}
