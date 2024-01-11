import { join, resolve } from 'node:path';
import highlighter from './src/lib/codeHighlighter.mjs';

const __dirname = resolve();

const config = {
	extensions: ['.md'],
	highlight: {
		highlighter
	},
	layout: join(__dirname, './src/lib/mdx/MarkdownLayout.svelte')
};

export default config;
