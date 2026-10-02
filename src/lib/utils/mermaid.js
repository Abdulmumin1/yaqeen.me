import { browser } from '$app/environment';
import { openMermaidModal } from './mermaidModalStore.js';

const palettes = {
	// Paper and ink. A box is hatched in a shade of the page and outlined in the
	// ink; lines and their labels are a step quieter.
	light: {
		background: '#fff7ed',
		primaryColor: '#efe6da',
		primaryTextColor: '#1c1917',
		primaryBorderColor: '#57534e',
		secondaryColor: '#f3ece3',
		secondaryTextColor: '#3d3935',
		secondaryBorderColor: '#a8a29e',
		tertiaryColor: '#fff7ed',
		tertiaryTextColor: '#57534e',
		tertiaryBorderColor: '#d6cfc7',
		lineColor: '#8f8780',
		textColor: '#1c1917',
		mainBkg: '#efe6da',
		nodeBorder: '#57534e',
		clusterBkg: 'transparent',
		clusterBorder: 'transparent',
		edgeLabelBackground: '#fff7ed',
		noteBkgColor: '#f3ece3',
		noteBorderColor: '#a8a29e',
		noteTextColor: '#3d3935'
	},
	dark: {
		background: '#1c1917',
		primaryColor: '#37312c',
		primaryTextColor: '#f5f5f4',
		primaryBorderColor: '#a8a29e',
		secondaryColor: '#2a2623',
		secondaryTextColor: '#e7e5e4',
		secondaryBorderColor: '#78716c',
		tertiaryColor: '#1c1917',
		tertiaryTextColor: '#d6d3d1',
		tertiaryBorderColor: '#44403c',
		lineColor: '#8f8780',
		textColor: '#f5f5f4',
		mainBkg: '#37312c',
		nodeBorder: '#a8a29e',
		clusterBkg: 'transparent',
		clusterBorder: 'transparent',
		edgeLabelBackground: '#1c1917',
		noteBkgColor: '#2a2623',
		noteBorderColor: '#78716c',
		noteTextColor: '#e7e5e4'
	}
};

function getColorMode() {
	return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getConfig(mode) {
	return {
		startOnLoad: false,
		theme: 'base',
		look: 'handDrawn',
		securityLevel: 'loose',
		suppressErrors: true,
		fontFamily: 'Virgil, Comic Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
		themeVariables: {
			...palettes[mode],
			fontSize: '14px'
		},
		flowchart: {
			curve: 'linear',
			nodeSpacing: 42,
			rankSpacing: 54,
			padding: 18,
			useMaxWidth: true,
			htmlLabels: true
		},
		sequence: {
			diagramMarginX: 32,
			diagramMarginY: 24,
			actorMargin: 64,
			messageMargin: 36,
			useMaxWidth: true
		},
		state: { useMaxWidth: true },
		er: { useMaxWidth: true }
	};
}

export function renderMermaid(node) {
	if (!browser || !node) return () => {};

	let frame;
	let isDestroyed = false;
	let colorMode = getColorMode();
	let mermaidModule;

	const run = async (force = false) => {
		if (isDestroyed) return;

		const selector = force ? '.mermaid' : '.mermaid:not([data-processed="true"])';
		const nodes = Array.from(node.querySelectorAll(selector));
		if (nodes.length === 0) return;

		for (const diagram of nodes) {
			if (!diagram.dataset.mermaidSource) {
				diagram.dataset.mermaidSource = diagram.textContent.trim();
			}

			if (force) {
				diagram.removeAttribute('data-processed');
				diagram.textContent = diagram.dataset.mermaidSource;
			}

			diagram.setAttribute('aria-label', 'Diagram');
		}

		try {
			mermaidModule ??= (await import('mermaid')).default;
			if (isDestroyed) return;

			mermaidModule.initialize(getConfig(colorMode));
			await mermaidModule.run({ nodes });

			// Attach click-to-open modal behavior on each rendered diagram
			for (const diagram of nodes) {
				if (diagram.dataset.modalBound) continue;
				diagram.dataset.modalBound = 'true';
				diagram.setAttribute('tabindex', '0');
				diagram.setAttribute('role', 'button');
				diagram.setAttribute('title', 'Click to expand diagram');
				diagram.classList.add('mermaid-interactive');

				const handleOpen = () => {
					const svg = diagram.querySelector('svg');
					if (!svg) return;
					// Clone svg and ensure viewBox/width attributes make it responsive
					const clone = svg.cloneNode(true);
					clone.removeAttribute('style');
					clone.style.width = '100%';
					clone.style.height = 'auto';
					clone.style.maxWidth = '100%';
					openMermaidModal(clone.outerHTML);
				};

				diagram.addEventListener('click', (e) => {
					e.stopPropagation();
					handleOpen();
				});

				diagram.addEventListener('keydown', (e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						handleOpen();
					}
				});
			}
		} catch (e) {
			console.error('Mermaid rendering failed', e);
		}
	};

	const themeObserver = new MutationObserver(() => {
		const nextMode = getColorMode();
		if (nextMode === colorMode) return;

		colorMode = nextMode;
		void run(true);
	});

	themeObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['class']
	});

	frame = requestAnimationFrame(run);

	return () => {
		isDestroyed = true;
		themeObserver.disconnect();
		cancelAnimationFrame(frame);
	};
}
