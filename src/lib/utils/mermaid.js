import { browser } from '$app/environment';

const palettes = {
	light: {
		background: '#fffaf5',
		primaryColor: '#ffedd5',
		primaryTextColor: '#292524',
		primaryBorderColor: '#fb923c',
		secondaryColor: '#f5f5f4',
		secondaryTextColor: '#44403c',
		secondaryBorderColor: '#d6d3d1',
		tertiaryColor: '#fff7ed',
		tertiaryTextColor: '#57534e',
		tertiaryBorderColor: '#fed7aa',
		lineColor: '#a8a29e',
		textColor: '#292524',
		mainBkg: '#ffedd5',
		nodeBorder: '#fb923c',
		clusterBkg: 'transparent',
		clusterBorder: 'transparent',
		edgeLabelBackground: '#fffaf5',
		noteBkgColor: '#fef3c7',
		noteBorderColor: '#f59e0b',
		noteTextColor: '#78350f'
	},
	dark: {
		background: '#211e1b',
		primaryColor: '#3b2a1f',
		primaryTextColor: '#fafaf9',
		primaryBorderColor: '#fb923c',
		secondaryColor: '#292524',
		secondaryTextColor: '#e7e5e4',
		secondaryBorderColor: '#57534e',
		tertiaryColor: '#1c1917',
		tertiaryTextColor: '#d6d3d1',
		tertiaryBorderColor: '#44403c',
		lineColor: '#a8a29e',
		textColor: '#fafaf9',
		mainBkg: '#3b2a1f',
		nodeBorder: '#fb923c',
		clusterBkg: 'transparent',
		clusterBorder: 'transparent',
		edgeLabelBackground: '#211e1b',
		noteBkgColor: '#422006',
		noteBorderColor: '#f59e0b',
		noteTextColor: '#fef3c7'
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
		fontFamily: 'Comic Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
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
