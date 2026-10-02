// What pops up when something on the home page is hovered (see
// $components/general/hoverPeek.svelte), keyed by its name: a project's name in
// projectStore, or `yaqeen` for the nickname in the hero.
//
// - An object is a print: a picture on a dithered mat. `image` comes from
//   static/peeks; without one the print uses the project's first picture in
//   projectStore. `pattern`, `matrix` and `ramp` describe the mat.
// - A print with a `caption` is a portrait: narrower, a 4:5 picture mounted on
//   paper with the caption written under it.
// - NO_UI is for the things that only exist in a terminal: they get a receipt.
// - Anything that is not listed gets nothing.
export const NO_UI = 'no-ui';

export const peeks = {
	// The man himself, and the name on his birth certificate.
	yaqeen: {
		image: '/peeks/yaqeen.webp',
		caption: 'abdulmumin abdulkarim',
		pattern: 'clouds',
		matrix: 4,
		ramp: ['#fff1e4', '#fdc9a5', '#f9411f', '#3d3aa6', '#1c1917']
	},

	Owostack: {
		image: '/peeks/owostack.webp',
		pattern: 'bands',
		matrix: 2,
		ramp: ['#f5efe4', '#d6564b', '#e29a37', '#2f9c6b', '#241d17']
	},
	Thirdpen: {
		image: '/peeks/thirdpen.webp',
		pattern: 'clouds',
		matrix: 4,
		ramp: ['#fbf3e4', '#9de8cb', '#00b2ff', '#1f2a6b', '#0a0e1a']
	},
	Littlestats: {
		image: '/peeks/littlestats.webp',
		pattern: 'bars',
		matrix: 4,
		ramp: ['#faf9f7', '#ecd9ff', '#c98bff', '#9b12ff', '#2a0a4a']
	},
	DevCanvas: {
		image: '/peeks/devcanvas.webp',
		pattern: 'waves',
		matrix: 4,
		ramp: ['#ffffff', '#d9f1ff', '#a9e1fd', '#63c6f7', '#1b6fa8']
	},
	// commentrig.com is not reachable to re-shoot, so this one borrows the old picture.
	CommentRig: {
		pattern: 'clouds',
		matrix: 4,
		ramp: ['#ffffff', '#dbeafe', '#60a5fa', '#2563eb', '#1e3a8a']
	},
	Chump: {
		image: '/peeks/chump.webp',
		pattern: 'rings',
		matrix: 4,
		ramp: ['#f7f4ee', '#eaf0c4', '#e4f326', '#a9b93a', '#3d4a1c']
	},
	'ai-query.dev': {
		image: '/peeks/ai-query.webp',
		pattern: 'clouds',
		matrix: 4,
		ramp: ['#fff5fd', '#fbcff5', '#f08cf0', '#c026d3', '#4a044e']
	},
	'onlocal.dev': {
		image: '/peeks/onlocal.webp',
		pattern: 'rings',
		matrix: 4,
		ramp: ['#fafaf9', '#e7e5e4', '#a8a29e', '#57534e', '#1c1917']
	},
	'Dear Future self': {
		image: '/peeks/dearfutureself.webp',
		pattern: 'waves',
		matrix: 4,
		ramp: ['#f4f4f5', '#dbeafe', '#bfdbfe', '#60a5fa', '#2563eb']
	},

	LMFetch: NO_UI,
	'smol.router': NO_UI,
	'py-fs-shell': NO_UI,
	Cull: NO_UI,
	'h-to-md': NO_UI
};
