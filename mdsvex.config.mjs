import { join, resolve } from 'node:path';
import highlighter from './src/lib/codeHighlighter.mjs';

import { visit } from 'unist-util-visit';

function unwrapComponents() {
  return (tree) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      const isComponentOnly =
        node.children.length === 1 &&
        node.children[0].type === 'mdxJsxFlowElement';

      if (isComponentOnly) {
        parent.children.splice(index, 1, node.children[0]);
      }
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
	rehypePlugins: [unwrapComponents]
};

export default config;
