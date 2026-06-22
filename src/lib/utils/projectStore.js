import { getContext, setContext } from 'svelte';
import { readable, writable } from 'svelte/store';

let overviewModalKey = 'overview-modal-key';
export function setModalContext() {
	setContext(overviewModalKey, writable(false));
}

export function getModalContext() {
	return getContext(overviewModalKey);
}

let currentProjectInModalKey = 'current-project-in-modal-key';
export function setCurrentProjectInModal() {
	setContext(currentProjectInModalKey, writable(false));
}

export function getCurrentProjectInModal() {
	return getContext(currentProjectInModalKey);
}

export const sass_projects = readable([
	{
		name: 'Owostack',
		year: '2026',
		stack: ['Sveltekit', 'Cloudflare', 'Honojs', 'AWS'],
		description: 'Provider agnostic billing engine for AI saas',
		links: {
			study: 'https://github.com/Abdulmumin1/owostack',
			page: 'owostack.com'
		},
		color: 'bg-sky-400',
		svg: '/thirdpen.svg',
		svgdark: '/thirdpen.svg',
		imagelist: [
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.15.51.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.16.21.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.15.24.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.23.29.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.22.31.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.20.09.png'
		]
	},
	{
		name: 'Thirdpen',
		year: '2025',
		stack: ['Sveltekit', 'Cloudflare', 'Honojs', 'AWS'],
		description: 'Interactive learning with AI',
		links: {
			page: 'thirdpen.app'
		},
		color: 'bg-sky-400',
		svg: '/thirdpen.svg',
		svgdark: '/thirdpen.svg',
		imagelist: [
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.15.51.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.16.21.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.15.24.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.23.29.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.22.31.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.20.09.png'
		]
	},
	{
		name: 'Littlestats',
		year: '2024',
		stack: ['Sveltekit', 'Clickhouse', 'Pocketbase', 'AWS'],
		description: 'Data to make good business decisions',
		links: {
			study: 'https://github.com/Abdulmumin1/littlestats',
			page: 'Littlestats.click'
		},
		color: 'bg-sky-400',
		svg: '/littlestats.svg',
		svgdark: '/littlestatsdark.svg',
		imagelist: [
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.27.44.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.27.55.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.28.04.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.28.15.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2001.28.49.png'
		]
	},
	{
		name: 'DevCanvas',
		year: '2023',
		stack: ['Svelte', 'Tailwindcss', 'Supabase', 'Javascript'],
		description: 'open source codepen alternative',
		links: {
			study: 'https://github.com/Abdulmumin1/devcanvas',
			page: 'devcanvas.dev'
		},
		color: 'bg-sky-400',
		svg: '/devcanvas.svg',
		svgdark: '/devcanvasdark.svg',
		imagelist: [
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727329710/Screenshot_2024-09-26_at_06-45-43_DevCanvas_-_Super_Fast_Online_Editor_pyfm5u.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727329710/Screenshot_2024-09-26_at_06-45-52_DevCanvas_-_Super_Fast_Online_Editor_bgippq.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727329709/Screenshot_2024-09-26_at_06-46-03_DevCanvas_-_Super_Fast_Online_Editor_hjzktu.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727329709/Screenshot_2024-09-26_at_06-46-25_Explore_vvrutt.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727329709/Screenshot_2024-09-26_at_06-46-59_Retro_UI_-_Windows_95_With_HMTL_CSS_hknwhh.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727329709/Screenshot_2024-09-26_at_06-47-50_qcvv2u.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727329709/Screenshot_2024-09-26_at_06-48-06_m7ia0m.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727329791/Screenshot_2024-09-26_at_06-49-35_Devcanvas_-_How_I_ended_up_building_it_ic0xtd.png'
		]
	},
	{
		name: 'CommentRig  (inactive)',
		year: '2022',
		stack: ['Svelte', 'Tailwindcss', 'Supabase', 'Javascript'],
		description: 'A modern comment system for blogs and websites',
		links: {
			page: 'commentrig.com'
		},
		color: 'bg-sky-400',
		svg: '/commentrig.svg',
		svgdark: '/commentrigdark.svg',
		imagelist: [
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727329005/Screenshot_2024-09-26_at_06-36-29_CommentRig_wqy4mn.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328524/Screenshot_2024-09-25_at_14-40-35_Form_Validation_with_Only_HTML5_and_CSS_w2d5ii.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328524/Screenshot_2024-09-25_at_14-41-12_2_Dashboard_-_CommentRig_llvtb5.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328523/Screenshot_2024-09-25_at_14-41-58_2_Notification_dijf1z.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328523/Screenshot_2024-09-25_at_14-42-10_2_Notification_q8u15c.png'
		]
	}
]);
export const project_data = readable([
	{
		name: 'Chump',
		year: '2026',
		stack: ['TypeScript', 'Svelte', 'Python', 'Websockets'],
		description:
			'CLI coding agent with first-class support for collaborative coding. Web, CLI, and mobile clients.',
		links: {
			study: 'https://github.com/Abdulmumin1/chump',
			page: 'chump.yaqeen.me'
		},
		imagelist: [
			'https://mac-file.yaqeen.me/5CE35DDF-b127847a9978f074f3760f4428c4fc8814df8e7c1ff52452c614a03616435d84.png'
		]
	},
	{
		name: 'ai-query.dev',
		year: '2026',
		stack: ['python', 'ai-http', 'websockets'],
		description: 'A python sdk for building stateful AI Agents',
		links: {
			study: 'https://github.com/Abdulmumin1/ai-query',
			page: 'ai-query.dev'
		},
		imagelist: [
			'https://rawcontent.dearfutureself.me/portfolio/ai-query-image-21.06.14.png',
			'https://rawcontent.dearfutureself.me/portfolio/ai-query-image-21.06.29.png',
			'https://rawcontent.dearfutureself.me/portfolio/ai-query-image-21.07.02.png',
			'https://rawcontent.dearfutureself.me/portfolio/ai-query-image-21.07.13.png',
			'https://rawcontent.dearfutureself.me/portfolio/ai-query-image-21.07.29.png'
		]
	},
	{
		name: 'onlocal.dev',
		year: '2025',
		stack: ['bunjs', 'cloudflare', 'websockets'],
		description: 'A tunnel server to expose your localhost to the internet. My take on ngrok.',
		links: {
			study: 'https://github.com/Abdulmumin1/onlocal',
			page: 'onlocal.dev'
		},
		imagelist: [
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-23%20at%2021.32.33.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-23%20at%2021.28.27.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-23%20at%2021.29.52.png'
		]
	},

	{
		name: 'LMFetch',
		year: '2025',
		stack: ['Python', 'Coroutines', 'Thread pool'],
		description:
			"a tool (cli,mcp) that fetches, chunks, supports local codebase and GitHub repo, takes a query, ranks code context. It's designed to fit the most relevant code into a token budget",
		links: {
			study: 'https://github.com/Abdulmumin1/lmfetch'
		},
		imagelist: [
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2000.49.41.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2000.50.15.png'
		]
	},
	{
		name: 'Dear Future self',
		year: '2025',

		stack: ['Svelte', 'Tailwind'],
		description: 'A portal to visit your future self',
		links: {
			page: 'dearfutureself.me'
		},
		imagelist: [
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2000.41.47.png',
			'https://rawcontent.dearfutureself.me/portfolio/annotely_image%20(1).jpeg'
		]
	},
	{
		name: 'tiny.router',
		year: '2026',
		stack: ['Python', 'LLMs', 'Routing'],
		description:
			'A tiny, calibrated capability router that picks the smallest language model capable of answering correctly',
		links: {
			study: 'https://github.com/Abdulmumin1/tiny.router'
		},
		imagelist: []
	},

	{
		name: 'Cull',
		year: '2026',
		stack: ['Python', 'Coroutines', 'Thread pool'],
		description:
			'Uses Project Think harness and virtual file system cloudflare/shell to triage your docs/codebase and answer questions',
		links: {
			study: 'https://github.com/Abdulmumin1/cull'
		},
		imagelist: []
	},

	{
		name: 'py-fs-shell',
		year: '2026',
		stack: ['Python', 'Virtual File System'],
		description:
			'A virtual file system for Python - interact with a simulated shell environment programmatically',
		links: {
			study: 'https://github.com/Abdulmumin1/py-fs-shell'
		},
		imagelist: []
	},

	{
		name: 'h-to-md',
		year: '2026',
		stack: ['JavaScript', 'HTML'],
		description: 'Super fast HTML to markdown converter',
		links: {
			study: 'https://github.com/Abdulmumin1/h-to-md'
		},
		imagelist: []
	},

	{
		name: 'DrShare',
		year: '2026',
		stack: ['bunjs', 'ink', 'hash-algorithm'],
		description: 'Local-first LAN drop lane for Mac, browser, and mobile clients',
		links: {
			study: 'https://github.com/Abdulmumin1/drshare'
		},
		imagelist: [
			'https://rawcontent.dearfutureself.me/portfolio/tiny-uth-image-2.png',
			'https://rawcontent.dearfutureself.me/portfolio/tiny.auth-image-1.png'
		]
	},

	{
		name: 'tiny.auth',
		year: '2025',
		stack: ['bunjs', 'ink', 'hash-algorithm'],
		description: 'A TOTP client for the CLI',
		links: {
			study: 'https://github.com/Abdulmumin1/tiny.authenticator'
		},
		imagelist: [
			'https://rawcontent.dearfutureself.me/portfolio/tiny-uth-image-2.png',
			'https://rawcontent.dearfutureself.me/portfolio/tiny.auth-image-1.png'
		]
	},

	{
		name: 'tiny.search',
		year: '2025',
		stack: ['TypeScript', 'Vector Embeddings'],
		description:
			'A minimal search engine using vector embeddings for semantic search over crawled web pages',
		links: {
			study: 'https://github.com/Abdulmumin1/tiny.search'
		},
		imagelist: []
	},

	{
		name: 'Cfinbox',
		year: '2025',
		stack: ['Cloudflare', 'Email'],
		description:
			'A full-stack email solution running entirely on Cloudflare. Receive inbox emails, send transactional emails, manage contacts, and run newsletter campaigns',
		links: {
			study: 'https://github.com/Abdulmumin1/cfinbox'
		},
		imagelist: []
	},

	{
		name: 'Yochat',
		year: '2025',

		stack: ['Svelte', 'Tailwind'],
		description:
			'Your fastest way to an llm - a cli tool that lets you chat with an llm at the speed of executing terminal commands',
		links: {
			study: 'https://github.com/Abdulmumin1/yochat',
			page: 'yochat.yaqeen.me'
		},
		imagelist: [
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2000.32.46.png',
			'https://rawcontent.dearfutureself.me/portfolio/Screenshot%202025-11-16%20at%2000.34.33.png'
		]
	},
	{
		name: 'kbar-svelte-mini',
		year: '2024',

		stack: ['svelte'],
		description: 'A port of react kbar for svelte. hit cmd+k on this website to see it in action',
		image: '$lib/static/images/edit.jpg',
		links: {
			study: 'https://github.com/Abdulmumin1/kbar-svelte-mini',
			page: 'kbar.yaqeen.me'
		},
		color: 'bg-white',
		imagelist: [
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727330397/Screenshot_2024-09-26_at_06-58-28_veeikw.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727330396/Screenshot_2024-09-26_at_06-58-39_xyyxsr.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727330396/Screenshot_2024-09-26_at_06-58-51_Getting_Started_oajzdb.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727330395/Screenshot_2024-09-26_at_06-59-44_Data_Structure_m1vhf3.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727330396/Screenshot_2024-09-26_at_06-59-00_Programmatic_Functions_dr8jl7.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727330395/Screenshot_2024-09-26_at_06-59-44_Data_Structure_m1vhf3.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727330395/Screenshot_2024-09-26_at_06-59-07_Data_Structure_ysqdtq.png'
		]
	},
	{
		name: 'Habitud',
		year: '2023',

		stack: ['Svelte', 'Tailwindcss', 'Supabase', 'Javascript'],
		description: 'Habit tracking app with passkeys integration',
		links: {
			study: 'https://github.com/Abdulmumin1/habitud',
			page: 'habitud.yaqeen.me'
		},
		color: 'bg-orange-200',
		imagelist: [
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331162/Screenshot_2024-09-26_at_07-12-00_x1f24k.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331162/Screenshot_2024-09-26_at_07-12-15_z70y7k.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331163/Screenshot_2024-09-26_at_07-12-24_vg8wlf.png'
		]
	},

	{
		name: 'Liseen',
		year: '2024',

		stack: ['Svelte', 'Tailwind'],
		description: 'Listen to youtube videos as audio',
		links: {
			study: 'https://github.com/Abdulmumin1/liseen',
			page: 'liseen.vercel.app'
		},
		imagelist: [
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727330805/Screenshot_2024-09-26_at_07-04-03_Liseen_ivbjzg.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727330847/Screenshot_2024-09-26_at_07-07-15_Liseen_gumnxd.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727330805/Screenshot_2024-09-26_at_07-06-04_Liseen_vqsdny.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727330805/Screenshot_2024-09-26_at_07-06-23_Liseen_ejogdd.png'
		]
	},

	{
		name: 'Drop',
		year: '2023',

		stack: ['Qt', 'Flask', 'HTML', 'Socket', 'CSS2'],
		description:
			'A fast and secure desktop app that allows you to share files across multiple devices',
		links: {
			study: 'https://github.com/Abdulmumin1/drop',
			page: '/drop'
		},
		onpage: true,
		color: 'bg-orange-400 dark:bg-orange-500',
		imagelist: [
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331682/Screenshot_from_2024-09-26_07-19-55_eq8esf.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331682/Screenshot_from_2024-09-26_07-20-00_lga9gf.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331691/Screenshot_2024-09-26_at_07-20-53_Drop_r3yltl.png'
		]
	},
	{
		name: 'Edit',
		year: '2022',
		stack: ['Vanillajs', 'TailwindCSS', 'HTML'],
		description: 'A Progressive Wep App to edit and frame screenshots beautifully',
		image: '$lib/static/images/edit.jpg',
		links: {
			study: 'https://github.com/Abdulmumin1/kbar-svelte-mini',
			page: 'editss.yaqeen.me'
		},
		color: 'bg-white',
		imagelist: [
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328524/Screenshot_2024-09-25_at_14-47-23_Edit_l5zvat.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328524/Screenshot_2024-09-25_at_14-47-33_Edit_fpyevx.png'
		]
	},
	{
		name: 'BrainTime',
		year: '2022',

		stack: ['Python', 'CSS2', 'PyQt5'],
		description: 'Excell in you thinking ability with curated brain exercises',
		links: {
			study: 'https://github.com/Abdulmumin1/braintime',
			page: '/braintime'
		},
		onpage: true,
		imagelist: [
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331689/Screenshot_from_2024-09-26_07-16-45_fcufmv.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331688/Screenshot_from_2024-09-26_07-16-51_umw5on.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331686/Screenshot_from_2024-09-26_07-17-10_ekyrqm.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331686/Screenshot_from_2024-09-26_07-17-22_msorwn.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331682/Screenshot_from_2024-09-26_07-17-28_mf1dlm.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331682/Screenshot_from_2024-09-26_07-17-42_biiqxb.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331980/Screenshot_from_2024-09-26_07-25-39_vbxjrq.png'
		]
	},
	{
		name: 'Quix',
		year: '2022',
		stack: ['Python', 'PyQt5'],
		description: 'An open source trivia quiz game',
		links: {
			study: 'https://github.com/Abdulmumin1/Quix'
		},
		imagelist: []
	},
	{
		name: 'Status-Saver',
		year: '2022',
		stack: ['Flutter', 'Dart'],
		description: 'Mobile app that saves viewed WhatsApp status media to your local storage',
		links: {
			study: 'https://github.com/Abdulmumin1/Status-Saver'
		},
		imagelist: []
	}
]);

export const project_data_main = readable([
	{
		name: 'DevCanvas',
		year: '2023',
		stack: ['Svelte', 'Tailwindcss', 'Supabase', 'Javascript'],
		description: 'Online Code Editor, to paint, build and share cool html/css/js creations',
		links: {
			study: 'https://github.com/Abdulmumin1/devCanvas',
			page: 'https://devcanvas.dev'
		},
		color: 'bg-sky-400'
	},
	{
		name: 'Habitud',
		year: '2023',

		stack: ['Svelte', 'Tailwindcss', 'Supabase', 'Javascript'],
		description: 'Habit tracking app with passkeys integration',
		links: {
			study: 'https://github.com/Abdulmumin1/habitud',
			page: 'https://habitud.yaqeen.me'
		},
		color: 'bg-orange-200'
	},

	{
		name: 'Drop',
		year: '2023',

		stack: ['Qt', 'Flask', 'HTML', 'Socket'],
		description:
			'A fast and secure desktop app that allows you to share files across multiple devices',
		links: {
			study: 'https://github.com/Abdulmumin1/drop',
			page: '/drop'
		},
		color: 'bg-orange-400 dark:bg-orange-500'
	},
	{
		name: 'Edit',
		year: '2022',
		stack: ['Vanillajs', 'TailwindCSS', 'HTML'],
		description: 'A Progressive Wep App to edit and frame screenshots beautifully',
		image: '$lib/static/images/edit.jpg',
		links: {
			study: 'https://github.com/Abdulmumin1/kbar-svelte-mini',
			page: 'https://editss.yaqeen.me'
		},
		color: 'bg-white'
	},
	{
		name: 'TCP Chat 2',
		year: '2022',

		stack: ['Python', 'PyQT5', 'SQLite3', 'HTML', 'CSS'],
		description:
			'An extenstion of the commandline tcp chat, with desktop interface, notifications and markdown messages! ',
		links: {
			study: 'https://github.com/Abdulmumin1/ChatDesktopApp',
			page: 'https://github.com/Abdulmumin1/ChatDesktopApp'
		}
	},
	{
		name: 'Braintime',
		year: '2022',

		stack: ['Python', 'CSS3', 'PyQt5'],
		description: 'Excell in you thinking ability with curated brain exercises',
		links: {
			study: 'https://github.com/Abdulmumin1/BrainTime',
			page: '/braintime'
		}
	},
	{
		name: 'Data Prison (Mobile)',
		year: '2022',

		stack: ['Python', 'Kivy', 'KivyMD', 'SQLite3'],
		description: 'A secure mobile app to save passowrds built with python kivymd and sqlite3',
		links: {
			study: 'https://github.com/Abdulmumin1/DataPrison-mobile-',
			page: 'https://github.com/Abdulmumin1/DataPrison-mobile-'
		}
	},
	{
		name: 'Data Prison (Desktop)',
		year: '2021',
		stack: ['Python', 'PyQT5', 'SQLite3'],
		description: 'A secure desktop app to save passowrds built with python pyqt5 and sqlite3.',
		links: {
			study: 'https://github.com/Abdulmumin1/dataprison/',
			page: 'https://github.com/Abdulmumin1/dataprison/'
		}
	}
]);
