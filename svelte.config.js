import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';
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

const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/components'
		}
	},
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
	// Enable incremental builds
	inlineEntryPoints: false
};

export default config;
