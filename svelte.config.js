import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import mdsvexConfig from './mdsvex.config.mjs';
import { mdsvex } from 'mdsvex';
// import shiki from 'shiki';

/** @type {import('@sveltejs/kit').Config} */

// const mdsvexConf = {
// 	extensions: ['.md'],
// 	highlight: {
// 		highlighter: async (code, lang = 'text') => {
// 			const highlighter = await shiki.getHighlighter({
// 				theme: 'min-dark'
// 			});
// 			const html = escapeSvelte(highlighter.codeToHtml(code, { lang }));
// 			return `{@html \`${html}\`}`;
// 		}
// 	}
// };

const inlineHtmlParagraphs = {
	name: 'inline-html-paragraphs',
	markup({ content, filename }) {
		if (!filename?.endsWith('.md')) return;

		return {
			code: content.replace(/^(?=<(?:span|mark|small|strong|em|b|i|u|s)(?:\s|>))/gim, '&#8203;')
		};
	}
};

const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/components'
		}
	},
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), inlineHtmlParagraphs, mdsvex(mdsvexConfig)],
	// Enable incremental builds
	inlineEntryPoints: false
};

export default config;
