/* A small highlighter for the few lines of code on /work. It knows just
   enough of shell, JavaScript and Python to colour comments, strings,
   keywords, calls and numbers, in the same tokens the posts use. */

const KEYWORDS = {
	js: 'import from const let await async export function return new true false',
	py: 'from import async with await as def return for in True False None'
};

function escape(text) {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function patternFor(lang) {
	const parts = [];
	if (lang === 'js') parts.push(String.raw`(?<comment>\/\/[^\n]*)`);
	else parts.push(String.raw`(?<comment>(?<=^|\s)#[^\n]*)`);

	const strings = [String.raw`"(?:[^"\\\n]|\\.)*"`, String.raw`'(?:[^'\\\n]|\\.)*'`];
	if (lang === 'js') strings.push(String.raw`\x60(?:[^\x60\\]|\\.)*\x60`);
	parts.push(`(?<string>${strings.join('|')})`);

	if (KEYWORDS[lang])
		parts.push(String.raw`(?<keyword>\b(?:${KEYWORDS[lang].split(' ').join('|')})\b)`);

	if (lang === 'sh') {
		// The command at the start of a line is what is called; flags are constants.
		parts.push(String.raw`(?<call>(?<=^[ \t]*)[A-Za-z][\w.-]*)`);
		parts.push(String.raw`(?<constant>(?<=\s)--?[A-Za-z][\w-]*)`);
	} else {
		parts.push(String.raw`(?<call>\b[A-Za-z_]\w*(?=\())`);
	}
	parts.push(String.raw`(?<number>\b\d+(?:\.\d+)?\b)`);
	return new RegExp(parts.join('|'), 'gm');
}

const patterns = new Map();

/** @param {string} code @param {'sh' | 'js' | 'py'} lang @returns {string} HTML */
export function highlight(code, lang = 'sh') {
	if (!patterns.has(lang)) patterns.set(lang, patternFor(lang));
	const pattern = patterns.get(lang);
	let html = '';
	let last = 0;
	for (const match of code.matchAll(pattern)) {
		const [kind] = Object.entries(match.groups).find(([, value]) => value !== undefined);
		html += escape(code.slice(last, match.index));
		html += `<span class="tok-${kind}">${escape(match[0])}</span>`;
		last = match.index + match[0].length;
	}
	return html + escape(code.slice(last));
}
