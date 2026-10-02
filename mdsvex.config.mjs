import { join, resolve } from 'node:path';
import highlighter from './src/lib/codeHighlighter.mjs';

import { visit } from 'unist-util-visit';

function unwrapComponents() {
	return (tree) => {
		visit(tree, 'paragraph', (node, index, parent) => {
			const isComponentOnly =
				node.children.length === 1 && node.children[0].type === 'mdxJsxFlowElement';

			if (isComponentOnly) {
				parent.children.splice(index, 1, node.children[0]);
			}
		});
	};
}

// Inline code is kept in one piece (see "Articles" in src/app.css), so that
// `ai-query` never breaks at its hyphen. Something too long for that, a whole
// command say, is marked here so that it may wrap. Fenced code never reaches
// this: the highlighter has already turned it into raw HTML.
const LONG_CODE = 28;

function markLongCode() {
	return (tree) => {
		visit(tree, 'element', (node) => {
			if (node.tagName !== 'code') return;
			const text = (node.children ?? []).map((child) => child.value ?? '').join('');
			if (text.length <= LONG_CODE) return;
			node.properties = { ...node.properties, className: ['long'] };
		});
	};
}

const __dirname = resolve();

const config = {
	extensions: ['.md'],
	highlight: {
		highlighter
	},
	layout: {
		series: join(__dirname, './src/lib/mdx/seriesLayout.svelte'),
		_: join(__dirname, './src/lib/mdx/MarkdownLayout.svelte')
	},
	rehypePlugins: [unwrapComponents, markLongCode]
};

export default config;
