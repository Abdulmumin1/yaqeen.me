import { parse } from 'node-html-parser';
import { getHighlighter } from 'shiki';

const THEME = 'css-variables';

// Only load the languages actually used in the blog. Shiki's default is to
// load every bundled language on first getHighlighter() call, which balloons
// memory when combined with eager glob imports of all markdown posts.
const highlighterPromise = getHighlighter({
	theme: THEME,
	langs: [
		'bash',
		'css',
		'dockerfile',
		'html',
		'javascript',
		'json',
		'powershell',
		'python',
		'rust',
		'sql',
		'svelte',
		'typescript'
	]
});

/**
 * Returns code with curly braces and backticks replaced by HTML entity equivalents
 * @param {string} html - highlighted HTML
 * @returns {string} - escaped HTML
 */
function escapeHtml(code) {
	return code.replace(
		/[{}`]/g,
		(character) => ({ '{': '&lbrace;', '}': '&rbrace;', '`': '&grave;' })[character]
	);
}

/**
 * Safely escapes characters for HTML content in Svelte templates
 * @param {string} text - text to escape
 * @returns {string} - escaped text
 */
function escapeMermaid(text) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/{/g, '&lbrace;')
		.replace(/}/g, '&rbrace;')
		.replace(/`/g, '&grave;');
}

/**
 * Returns array of line numbers to be highlghted
 * @param {string} rangeString - range string to be parsed (e.g. {1,3-5,8})
 * @returns {number[]}
 */
function rangeParser(rangeString) {
	const result = [];
	const ranges = rangeString.split(',');
	ranges.forEach((element) => {
		if (element.indexOf('-') === -1) {
			result.push(parseInt(element, 10));
		} else {
			const limits = element.split('-');
			const start = parseInt(limits[0], 10);
			const end = parseInt(limits[1], 10);
			for (let i = start; i <= end; i += 1) {
				result.push(i);
			}
		}
	});
	return result;
}

// What a fence says its language is, as the corner of a listing should name it.
const LANGUAGE_NAMES = {
	js: 'javascript',
	ts: 'typescript',
	py: 'python',
	sh: 'bash',
	shell: 'bash',
	docker: 'dockerfile'
};
const UNNAMED = new Set(['', 'text', 'txt', 'plaintext']);

/**
 * Wraps a listing so it can carry a corner (see `.code` in app.css): the corner
 * names the language, and copies the listing when it is pressed
 * (src/lib/mdx/copyCode.js).
 *
 * @param html {string} - highlighted html
 * @param lang {string} - the fence's language
 * @returns {string} - the listing, focusable and wrapped
 */
function frame(html, lang) {
	const root = parse(html);
	root.querySelector('pre').setAttribute('tabIndex', '0');
	const name = String(lang ?? '')
		.toLowerCase()
		.replace(/[^a-z0-9+#.-]/g, '');
	const label = UNNAMED.has(name) ? '' : (LANGUAGE_NAMES[name] ?? name);
	return (
		`<div class="code">${root.toString()}` +
		`<button type="button" class="code-copy" data-label="${label}" aria-label="Copy this code"></button></div>`
	);
}

/**
 * @param code {string} - code to highlight
 * @param lang {string} - code language
 * @param meta {string} - code meta
 * @returns {string} - highlighted html
 */
async function highlighter(code, lang, meta) {
	if (lang === 'mermaid') {
		return `<pre class="mermaid">${escapeMermaid(code)}</pre>`;
	}

	const shikiHighlighter = await highlighterPromise;

	let html;
	if (!meta) {
		html = shikiHighlighter.codeToHtml(code, {
			lang
		});
	} else {
		const highlightMeta = /{([\d,-]+)}/.exec(meta)[1];
		const highlightLines = rangeParser(highlightMeta);

		html = shikiHighlighter.codeToHtml(code, {
			lang,
			lineOptions: highlightLines.map((element) => ({
				line: element,
				classes: ['highlight-line']
			}))
		});
	}
	return escapeHtml(frame(html, lang));
}

export default highlighter;
