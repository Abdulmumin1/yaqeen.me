import { get } from 'svelte/store';
import { resolve } from '$app/paths';
import { project_data, sass_projects } from '$lib/utils/projectStore.js';

/* Everything on /work, in the order it is walked through. Each chapter is a
   number, a title, a line that says what it is about, and rows of entries.

   An entry:

   {
     slug:    'lil-redis',                unique, used as the key
     title:   'lil-redis',
     year:    '2026',                     optional
     kind:    'system',                   a word for what it is
     summary: 'One or two lines on what it is.',
     media:   { type: 'youtube', id }                      plays in the theater
            | { type: 'video', src, loop?, poster, ratio?, cardRatio?, length?, playOn? }
                  src plays with sound in the theater; loop is a short silent
                  clip the card plays while it is on screen, or, with
                  playOn: 'hover', only while it is pointed at
             | { type: 'image', src, ratio? }               opens in the theater
             | { type: 'code', lang: 'sh' | 'js' | 'py', code }
                  for things with no recording yet: a few lines of how it's used
     links:   { site?, code?, post? }
     room:    { pattern, matrix, ramp }   the theater's colours, optional
   }

   A row is { layout, entries }, with layout one of 'feature' (two across),
   'grid' (three), 'posters' (four, tall), 'small' (four, short) or 'index'
   (a list, for things with nothing to show but words). */

const projects = [...get(sass_projects), ...get(project_data)];

function href(link) {
	if (!link) return undefined;
	if (link.startsWith('/') || link.startsWith('http')) return link;
	return `https://${link.toLowerCase()}`;
}

function slugFor(name) {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

// Name, year, line and links from the project list the home page uses too.
function fromProject(name, extra = {}) {
	const project = projects.find((item) => item.name === name);
	return {
		slug: slugFor(name),
		title: project?.name ?? name,
		year: project?.year,
		summary: project?.description,
		links: { site: href(project?.links?.page), code: href(project?.links?.study) },
		...extra
	};
}

const gh = (repo) => `https://github.com/Abdulmumin1/${repo}`;

/** An entry's links, in a fixed order, ready for an <a>: ours resolved, others in a new tab. */
export function linksOf(entry) {
	return ['site', 'code', 'post']
		.filter((name) => entry?.links?.[name])
		.map((name) => {
			const link = entry.links[name];
			const internal = link.startsWith('/');
			return {
				name,
				internal,
				href: internal ? resolve(link) : link,
				arrow: internal ? '→' : '↗',
				target: internal ? undefined : '_blank',
				rel: internal ? undefined : 'noopener noreferrer'
			};
		});
}

// The theater's colours, after the films themselves.
const rooms = {
	chump: {
		pattern: 'rings',
		matrix: 4,
		ramp: ['#0c0a09', '#14180a', '#232a10', '#3c4715', '#5d6917']
	},
	aiQuery: {
		pattern: 'clouds',
		matrix: 4,
		ramp: ['#0c0a09', '#1a071f', '#310a3a', '#551062', '#86198f']
	},
	owostack: {
		pattern: 'bands',
		matrix: 2,
		ramp: ['#0c0a09', '#3a1512', '#4a300f', '#12382a', '#0c0a09']
	},
	thirdpen: {
		pattern: 'clouds',
		matrix: 4,
		ramp: ['#06080f', '#0a1230', '#102d63', '#0b5680', '#0f84b8']
	},
	dusk: {
		pattern: 'bands',
		matrix: 4,
		ramp: ['#0b0d1f', '#1c1f48', '#34387f', '#8a4f8f', '#e0889a']
	},
	night: {
		pattern: 'rings',
		matrix: 4,
		ramp: ['#05081a', '#0a1230', '#11204f', '#1a3f8f', '#2f7fd6']
	},
	terminal: {
		pattern: 'bars',
		matrix: 2,
		ramp: ['#0c0a09', '#141210', '#1c1917', '#262220', '#302b27']
	}
};

const media = (name) => `/work/${name}`;

// A recording of a system at work in the terminal. They are short and small,
// so the card plays the whole session, silent, and the theater plays it large.
// A chapter of terminals all typing at once is a lot, so a card's session
// waits for the pointer. The poster is the last frame: the whole session.
const session = (name, length) => ({
	type: 'video',
	src: media(`${name}.mp4`),
	loop: media(`${name}.mp4`),
	poster: media(`${name}.jpg`),
	playOn: 'hover',
	length
});

/* ---- 01 · Products ------------------------------------------------------ */

const products = [
	fromProject('Chump', {
		kind: 'product',
		media: { type: 'youtube', id: 'B7cCCHSHM-k' },
		room: rooms.chump
	}),
	fromProject('ai-query.dev', {
		kind: 'product',
		media: { type: 'youtube', id: 'RMmiLAX0kxc' },
		room: rooms.aiQuery
	}),
	fromProject('Owostack', {
		kind: 'product',
		media: { type: 'youtube', id: 'vVq5Qrd2Qmc' },
		room: rooms.owostack
	}),
	fromProject('Thirdpen', {
		kind: 'product',
		media: { type: 'youtube', id: 'C6RJ8lcIKs4' },
		room: rooms.thirdpen
	})
];

/* ---- 02 · Systems ------------------------------------------------------- */

const systems = [
	{
		slug: 'lil-redis',
		title: 'lil-redis',
		year: '2026',
		kind: 'system',
		summary:
			'Redis inside a Cloudflare Durable Object. It speaks RESP over a WebSocket, knows about 75 commands, and keeps keys in SQLite with TTLs on alarms.',
		media: session('lil-redis', '0:31'),
		links: { code: gh('lil-redis') },
		room: rooms.terminal
	},
	{
		slug: 'onlocal',
		title: 'onlocal',
		year: '2025',
		kind: 'system',
		summary:
			'A localhost tunnel, like ngrok, on Workers and Durable Objects. Each tunnel gets its own object and subdomain. A CLI, an SDK and a desktop app.',
		media: session('onlocal', '0:25'),
		links: { site: 'https://onlocal.dev', code: gh('onlocal') },
		room: rooms.terminal
	},
	{
		slug: 'lmfetch',
		title: 'lmfetch',
		year: '2026',
		kind: 'dev tool',
		summary:
			'Finds and ranks the code an LLM needs from a folder or a GitHub repo, to fit a token budget. A CLI, a library and an MCP server, in Python and in Bun.',
		media: session('lmfetch', '0:27'),
		links: { code: gh('lmfetch') },
		room: rooms.terminal
	},
	{
		slug: 'tinyuth',
		title: 'tinyuth',
		year: '2025',
		kind: 'dev tool',
		summary:
			'A TOTP authenticator for the terminal. It reads QR codes off the screen, keeps secrets in the keychain, and imports from Google Authenticator.',
		media: session('tinyuth', '0:28'),
		links: { code: gh('tiny.authenticator') },
		room: rooms.terminal
	},
	{
		slug: 'tiny-search',
		title: 'tiny.search',
		year: '2025',
		kind: 'system',
		summary:
			'A small semantic search engine. A crawler that grows its own list of seeds, embeddings in Vectorize, and search on a Worker.',
		media: session('tiny-search', '0:28'),
		links: { code: gh('tiny.search') },
		room: rooms.terminal
	},
	{
		slug: 'h-to-md',
		title: 'h-to-md',
		year: '2026',
		kind: 'library',
		summary:
			'HTML to Markdown in a single pass, with no dependencies, for serving pages to agents that ask for text/markdown.',
		media: session('h-to-md', '0:26'),
		links: { code: gh('h-to-m') },
		room: rooms.terminal
	},
	{
		slug: 'py-fs-shell',
		title: 'py-fs-shell',
		year: '2026',
		kind: 'library',
		summary:
			'A virtual filesystem for agents, in memory, on disk or on S3, with search, diffs and planned edits. No dependencies.',
		media: session('py-fs-shell', '0:34'),
		links: { code: gh('py-fs-shell') },
		room: rooms.terminal
	},
	{
		slug: 'cull',
		title: 'Cull',
		year: '2026',
		kind: 'system',
		summary:
			'Keeps a repo synced on Cloudflare and answers questions about it and its docs, with Project Think and cloudflare/shell instead of RAG.',
		media: session('cull', '0:26'),
		links: { code: gh('cull') },
		room: rooms.terminal
	},
	{
		slug: 'oath',
		title: 'oath',
		year: '2026',
		kind: 'dev tool',
		summary:
			'Receipts for agents. A contract in OATH.toml, a checkpoint for every command run, and a signed receipt anyone can verify.',
		media: session('oath', '0:28'),
		links: { code: gh('oath') },
		room: rooms.terminal
	},
	fromProject('smol.router', {
		kind: 'model',
		media: session('smol-router', '0:29'),
		room: rooms.terminal
	}),
	// No recordings of these two yet, so a few lines of how each is used.
	{
		slug: 'cfinbox',
		title: 'Cfinbox',
		year: '2025',
		kind: 'system',
		summary:
			'Email, all on Cloudflare: mail comes in through Email Routing into D1, goes out through an API, with contacts and newsletters.',
		media: {
			type: 'code',
			lang: 'sh',
			code: 'curl -X POST $HOST/api/send \\\n  -H "X-API-Key: $API_KEY" \\\n  -d \'{"to": "ada@example.com", ...}\''
		},
		links: { code: gh('cfinbox') }
	},
	{
		slug: 'db-mcp',
		title: 'db-mcp',
		year: '2025',
		kind: 'dev tool',
		summary:
			'An MCP server that lets an agent query Postgres or MySQL, and only read: just SELECT and WITH get through.',
		media: {
			type: 'code',
			lang: 'sh',
			code: 'export DB_TYPE=postgres\nexport DB_HOST=localhost\nnode build/index.js\n\n# one tool for the agent: run_query'
		},
		links: { code: gh('db-mcp') }
	}
];

/* ---- 03 · Design & motion ----------------------------------------------- */

const films = [
	{
		slug: 'thirdpen-launch',
		title: 'Ada launches on Monday',
		year: '2026',
		kind: 'film',
		summary: 'The launch film for Thirdpen. Made in code with Remotion, the dither and all.',
		media: {
			type: 'video',
			src: media('thirdpen-launch.mp4'),
			loop: media('thirdpen-launch-loop.mp4'),
			poster: media('thirdpen-launch.jpg'),
			length: '0:50'
		},
		room: rooms.dusk
	},
	{
		slug: 'thirdpen-memory',
		title: 'Say it once',
		year: '2026',
		kind: 'film',
		summary: 'How Thirdpen remembers: a fact said in one chat, found in the next.',
		media: {
			type: 'video',
			src: media('thirdpen-memory.mp4'),
			loop: media('thirdpen-memory-loop.mp4'),
			poster: media('thirdpen-memory.jpg'),
			length: '0:25'
		},
		room: rooms.night
	},
	{
		slug: 'thirdpen-integrations',
		title: 'Every app it can reach',
		year: '2026',
		kind: 'film',
		summary: 'The apps Thirdpen connects to, and the permission it asks before it acts in one.',
		media: {
			type: 'video',
			src: media('thirdpen-integrations.mp4'),
			loop: media('thirdpen-integrations-loop.mp4'),
			poster: media('thirdpen-integrations.jpg'),
			length: '0:25'
		},
		room: rooms.thirdpen
	}
];

const posters = [
	['nine-languages', 'Nine languages', 'The announcement for Thirdpen in nine languages.'],
	['less-admin', 'Less admin, more selling', 'One of a set for sales teams.'],
	['plan-the-semester', 'You can just', 'One of a set for students.'],
	['rain-check', 'If it’ll rain', 'One of the small moments: a routine, set in a sentence.']
].map(([name, title, summary]) => ({
	slug: `poster-${name}`,
	title,
	year: '2026',
	kind: 'poster',
	summary,
	media: { type: 'image', src: media(`poster-${name}.jpg`), ratio: '4 / 5' },
	room: rooms.thirdpen
}));

/* ---- 04 · Experiments --------------------------------------------------- */

const experiments = [
	{
		slug: 'thirdpen-multilingual',
		title: 'Thirdpen, in nine languages',
		year: '2026',
		kind: 'experiment',
		summary:
			'The whole of thirdpen.app in English, Spanish, French, German, Portuguese, Arabic, Indonesian, Chinese and Hindi. Arabic reads right to left, mirrored end to end.',
		media: {
			type: 'video',
			src: media('thirdpen-multilingual.mp4'),
			loop: media('thirdpen-multilingual-loop.mp4'),
			poster: media('thirdpen-multilingual.jpg'),
			ratio: '1024 / 864',
			// On the card, the same shape as the film beside it; whole in the theater.
			cardRatio: '16 / 9',
			length: '1:09'
		},
		links: { site: 'https://thirdpen.app' },
		room: rooms.thirdpen
	},
	{
		slug: 'clankerline',
		title: 'Clankerline',
		year: '2026',
		kind: 'experiment',
		summary:
			'Lets a coding agent in the terminal phone you. The call runs on a Durable Object with Workers AI, and comes back to the agent as text.',
		media: { type: 'youtube', id: 'rv8pAYROFl0' },
		links: { code: gh('clankerline') }
	},
	{
		slug: 'css-faster',
		title: 'CSS-Faster',
		kind: 'experiment',
		summary: 'Write vanilla CSS faster, with Tailwind classes as snippets in VS Code.',
		media: {
			type: 'video',
			src: '/css-faster.mp4',
			loop: '/css-faster.mp4',
			poster: media('css-faster.jpg'),
			length: '0:20'
		},
		links: { site: '/css-faster', code: gh('css-faster') }
	},
	{
		slug: 'pairtick',
		title: 'Pairtick',
		year: '2026',
		kind: 'experiment',
		summary:
			'Pair programming paid by the second: chat, voice and video billed in 200 ms ticks. Made for CometChat’s #ZeroToChat.',
		links: { site: 'https://pairtick-production.up.railway.app', code: gh('pairtick') }
	},
	{
		slug: 'trackscreen',
		title: 'Trackscreen',
		year: '2026',
		kind: 'experiment',
		summary:
			'Turns an Android phone into a Bluetooth trackpad for a laptop, sending mouse reports over HID.'
	}
];

/* ---- 05 · Everything else ----------------------------------------------- */

const shown = new Set(
	[...products, ...systems, ...experiments]
		.map((entry) => entry.title)
		.concat(['onlocal.dev', 'LMFetch', 'tiny.auth', 'DrShare'])
);

// Pictures known to belong to another project, left off rather than shown wrong.
const borrowedPictures = new Set(['DrShare']);

const everythingElse = projects
	.filter((project) => !shown.has(project.name))
	.filter((project, index, list) => list.findIndex((item) => item.name === project.name) === index)
	.map((project) =>
		fromProject(project.name, {
			kind: 'project',
			media:
				project.imagelist?.[0] && !borrowedPictures.has(project.name)
					? { type: 'image', src: project.imagelist[0], ratio: '16 / 9' }
					: undefined
		})
	)
	.concat([
		fromProject('DrShare', {
			kind: 'tool',
			summary:
				'Local-first file and text sharing across a LAN, from a Mac menu bar to any browser nearby.'
		})
	])
	.sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0));

// With a picture, a card; without one, a line in the list after them.
const pictured = everythingElse.filter((entry) => entry.media);
const unpictured = everythingElse.filter((entry) => !entry.media);

/* ---- The walk ----------------------------------------------------------- */

export const chapters = [
	{
		id: 'products',
		number: '01',
		title: 'Products',
		lede: 'Things I’ve taken from an idea to people using them. Each one has the video I made to show it.',
		rows: [{ layout: 'feature', entries: products }]
	},
	{
		id: 'systems',
		number: '02',
		title: 'Systems',
		lede: 'Under the products: stores, tunnels, search, email and tools for agents, mostly on Cloudflare Workers and Durable Objects. Most of them recorded at work, in the terminal.',
		// Two across, so there is room to read a terminal while it plays.
		rows: [{ layout: 'feature', entries: systems }]
	},
	{
		id: 'design',
		number: '03',
		title: 'Design & motion',
		lede: 'I make the launch films and posters for what I build. These are for Thirdpen, the films made in code with Remotion.',
		rows: [
			{ layout: 'grid', entries: films },
			{ layout: 'posters', entries: posters }
		]
	},
	{
		id: 'experiments',
		number: '04',
		title: 'Experiments',
		lede: 'Things I made to see if they would work. Some of them did.',
		rows: [
			{
				layout: 'feature',
				entries: experiments.filter((entry) => ['video', 'youtube'].includes(entry.media?.type))
			},
			{
				layout: 'grid',
				entries: experiments.filter((entry) => !['video', 'youtube'].includes(entry.media?.type))
			}
		]
	},
	{
		id: 'everything-else',
		number: '05',
		title: 'Everything else',
		lede: 'The rest of it, newest first, back to the first things I made.',
		rows: [
			{ layout: 'small', entries: pictured },
			{ layout: 'index', entries: unpictured }
		]
	}
];
