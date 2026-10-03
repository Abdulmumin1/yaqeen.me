import { read } from '$app/server';
import { ImageResponse } from '@cf-wasm/og';
import { formatDate } from '$lib/js/utils.js';
import metrics from './pilcrow-rounded-400.json';
import pilcrowUrl from './pilcrow-rounded-400.ttf?url';
import archivoUrl from './archivo-italic-400.ttf?url';
import signatureUrl from './signature.png?url';

// A post's link preview, drawn when it is first asked for: the title as the
// post page sets it, the date under it, the nickname signed at the bottom and
// a monarch just past the title's last word, the way one sits on a heading on
// the site (spotOn in $lib/butterfly/habitat.js). The site's own card,
// static/og.png, is the same paper, type and butterfly ($lib/og/card.svelte).
//
// What only a browser can draw comes ready-made, photographed from the real
// thing: signature.png is the nickname with its marker line, and monarch-*.png
// are the 3D monarch sitting a few different ways, each with its shadow. The
// fonts are Pilcrow Rounded and Archivo pinned at 400, since the renderer
// cannot read the site's variable woff2 files, and pilcrow-rounded-400.json
// holds the letters' widths so titles can be wrapped before they are drawn.

const monarchUrls = Object.entries(
	import.meta.glob('./monarch-*.png', { query: '?url', import: 'default', eager: true })
)
	.sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
	.map(([, url]) => url);

const SCALE = 2; // drawn at twice 1200 x 630, sharp on retina screens
const PAPER = '#fff7ed';
const INK = '#1c1917'; // --color-text-main
const FAINT = '#918a84'; // --color-text-faint

// px, at 1200 x 630.
const PAGE = { width: 1200, height: 630, top: 92, left: 96 };
// As large as it will go, in no more than three lines and no taller than `height`.
const TITLE = {
	largest: 104,
	smallest: 56,
	lines: 3,
	height: 270,
	width: 880,
	leading: 1.15,
	tracking: -0.01
};
// Where the signature sits: where the marker line was photographed.
const SIGNATURE = { left: 77, top: 493, width: 190, height: 75 };
// The monarch photos are 1.4 times its span across, the butterfly in the middle.
const STAGE = 1.4;

let assets = null;

/** Fonts and pictures, read once per worker. */
function load() {
	assets ??= Promise.all([
		read(pilcrowUrl).arrayBuffer(),
		read(archivoUrl).arrayBuffer(),
		read(signatureUrl).arrayBuffer(),
		...monarchUrls.map((url) => read(url).arrayBuffer())
	]).then(([pilcrow, archivo, signature, ...monarchs]) => ({
		fonts: [
			{ name: 'Pilcrow Rounded', data: pilcrow, weight: 400, style: 'normal' },
			{ name: 'Archivo', data: archivo, weight: 400, style: 'italic' }
		],
		signature: toDataUrl(signature),
		monarchs: monarchs.map(toDataUrl)
	}));
	assets.catch(() => (assets = null));
	return assets;
}

function toDataUrl(buffer) {
	const bytes = new Uint8Array(buffer);
	let binary = '';
	for (let i = 0; i < bytes.length; i += 0x8000) {
		binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
	}
	return `data:image/png;base64,${btoa(binary)}`;
}

/** How wide `text` is set at `size` px. */
function measure(text, size) {
	let ems = 0;
	let count = 0;
	for (const char of text) {
		if (char === '‍' || char === '️') continue;
		ems += metrics.widths[char] ?? (/\p{Extended_Pictographic}/u.test(char) ? 1.1 : 0.55);
		count += 1;
	}
	return (ems + TITLE.tracking * count) * size;
}

/** Greedy: as many words on each line as fit in `width`. */
function wrap(words, size, width) {
	const lines = [];
	let line = '';
	for (const word of words) {
		const longer = line ? `${line} ${word}` : word;
		if (line && measure(longer, size) > width) {
			lines.push(line);
			line = word;
		} else {
			line = longer;
		}
	}
	if (line) lines.push(line);
	return lines;
}

/** The same number of lines, as even as they will go (text-wrap: balance, as on the post page). */
function balance(words, size) {
	const count = wrap(words, size, TITLE.width).length;
	if (count < 2) return wrap(words, size, TITLE.width);
	let narrow = 0;
	let wide = TITLE.width;
	while (wide - narrow > 1) {
		const middle = (narrow + wide) / 2;
		if (wrap(words, size, middle).length > count) narrow = middle;
		else wide = middle;
	}
	return wrap(words, size, wide);
}

/** Down from the largest size until the title fits. */
function fit(title) {
	const words = title.trim().split(/\s+/);
	for (let size = TITLE.largest; size >= TITLE.smallest; size -= 2) {
		const lines = balance(words, size);
		const widest = Math.max(...lines.map((line) => measure(line, size)));
		const tall = lines.length * size * TITLE.leading;
		if (
			lines.length <= TITLE.lines &&
			tall <= Math.min(size * TITLE.leading * TITLE.lines, TITLE.height) + 1 &&
			widest <= TITLE.width
		) {
			return { size, lines };
		}
	}
	return { size: TITLE.smallest, lines: balance(words, TITLE.smallest) };
}

/** The same butterfly for the same post, a different one from post to post. */
function pick(slug, count) {
	let hash = 7;
	for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
	return hash % count;
}

const px = (value) => Math.round(value * SCALE * 100) / 100;
const h = (type, style, children = [], props = {}) => ({
	type,
	props: { style, children, ...props }
});

/**
 * @param {{ slug: string, title: string, date?: string }} post
 * @param {ResponseInit['headers']} headers
 */
export async function postCard(post, headers) {
	const { fonts, signature, monarchs } = await load();
	const { size, lines } = fit(post.title);

	// Just past the last word, level with the middle of its line.
	const span = size + 36;
	const stage = span * STAGE;
	const lastLine = PAGE.top + (lines.length - 1) * size * TITLE.leading;
	const x = PAGE.left + measure(lines.at(-1), size) + span * 0.62;
	const y = lastLine + size * 0.585;

	const card = h(
		'div',
		{
			display: 'flex',
			flexDirection: 'column',
			position: 'relative',
			width: px(PAGE.width),
			height: px(PAGE.height),
			padding: `${px(PAGE.top)}px ${px(PAGE.left)}px 0`,
			backgroundColor: PAPER
		},
		[
			h(
				'div',
				{
					display: 'flex',
					flexDirection: 'column',
					color: INK,
					fontFamily: 'Pilcrow Rounded',
					fontSize: px(size),
					lineHeight: TITLE.leading,
					letterSpacing: px(size * TITLE.tracking)
				},
				lines.map((line) => h('div', { display: 'flex', whiteSpace: 'pre' }, line))
			),
			post.date
				? h(
						'div',
						{
							display: 'flex',
							marginTop: px(24),
							color: FAINT,
							fontFamily: 'Archivo',
							fontSize: px(28),
							fontStyle: 'italic',
							lineHeight: 1.45
						},
						formatDate(post.date)
					)
				: null,
			h(
				'img',
				{
					position: 'absolute',
					left: px(SIGNATURE.left),
					top: px(SIGNATURE.top),
					width: px(SIGNATURE.width),
					height: px(SIGNATURE.height)
				},
				[],
				{ src: signature, width: px(SIGNATURE.width), height: px(SIGNATURE.height) }
			),
			h(
				'img',
				{
					position: 'absolute',
					left: px(x - stage / 2),
					top: px(y - stage / 2),
					width: px(stage),
					height: px(stage)
				},
				[],
				{ src: monarchs[pick(post.slug, monarchs.length)], width: px(stage), height: px(stage) }
			)
		].filter(Boolean)
	);

	return ImageResponse.async(card, {
		width: px(PAGE.width),
		height: px(PAGE.height),
		fonts,
		headers
	});
}
