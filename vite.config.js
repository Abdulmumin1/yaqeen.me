import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import mdsvexConfig from './mdsvex.config.mjs';
import { mdsvex } from 'mdsvex';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

const inlineHtmlParagraphs = {
	name: 'inline-html-paragraphs',
	markup({ content, filename }) {
		if (!filename?.endsWith('.md')) return;

		return {
			code: content.replace(/^(?=<(?:span|mark|small|strong|em|b|i|u|s)(?:\s|>))/gim, '&#8203;')
		};
	}
};

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			extensions: ['.svelte', '.md'],
			preprocess: [vitePreprocess(), inlineHtmlParagraphs, mdsvex(mdsvexConfig)],
			adapter: adapter()
		})
	]
});
