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
		name: 'Thirdpen',
		stack: ['Sveltekit', 'Cloudflare', 'Honojs', 'AWS'],
		description: 'Interactive learning with AI',
		links: {
			page: 'thirdpen.app'
		},
		color: 'bg-sky-400',
		svg: '/thirdpen.svg',
		svgdark: '/thirdpen.svg',
		imagelist: [
			// 'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727329005/Screenshot_2024-09-26_at_06-36-29_CommentRig_wqy4mn.png',
			// 'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328524/Screenshot_2024-09-25_at_14-40-35_Form_Validation_with_Only_HTML5_and_CSS_w2d5ii.png',
			// 'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328524/Screenshot_2024-09-25_at_14-41-12_2_Dashboard_-_CommentRig_llvtb5.png',
			// 'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328523/Screenshot_2024-09-25_at_14-41-58_2_Notification_dijf1z.png',
			// 'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328523/Screenshot_2024-09-25_at_14-42-10_2_Notification_q8u15c.png'
		]
	},
	{
		name: 'Littlestats',
		stack: ['Sveltekit', 'Clickhouse', 'Pocketbase', 'AWS'],
		description: 'Affordable Analytics - Your analytics needs without breaking the bank',
		links: {
			page: 'Littlestats.click'
		},
		color: 'bg-sky-400',
		svg: '/littlestats.svg',
		svgdark: '/littlestatsdark.svg',
		imagelist: [
			// 'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727329005/Screenshot_2024-09-26_at_06-36-29_CommentRig_wqy4mn.png',
			// 'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328524/Screenshot_2024-09-25_at_14-40-35_Form_Validation_with_Only_HTML5_and_CSS_w2d5ii.png',
			// 'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328524/Screenshot_2024-09-25_at_14-41-12_2_Dashboard_-_CommentRig_llvtb5.png',
			// 'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328523/Screenshot_2024-09-25_at_14-41-58_2_Notification_dijf1z.png',
			// 'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328523/Screenshot_2024-09-25_at_14-42-10_2_Notification_q8u15c.png'
		]
	},
	{
		name: 'DevCanvas',
		stack: ['Svelte', 'Tailwindcss', 'Supabase', 'Javascript'],
		description: 'Build anything you want with AI!',
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
		name: 'CommentRig',
		stack: ['Svelte', 'Tailwindcss', 'Supabase', 'Javascript'],
		description: 'A seemless, powerfull modern comment management for websites',
		links: {
			page: 'www.commentrig.com'
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
	},

	
]);
export const project_data = readable([
	{
		name: 'Liseen',
		stack: ['Svelte', 'Tailwind'],
		description: 'Listen to youtube videos as audio',
		links: {
			study: 'https://github.com/Abdulmumin1/liseen',
			page: 'liseen.xyz'
		},
		imagelist: [
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727330805/Screenshot_2024-09-26_at_07-04-03_Liseen_ivbjzg.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727330847/Screenshot_2024-09-26_at_07-07-15_Liseen_gumnxd.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727330805/Screenshot_2024-09-26_at_07-06-04_Liseen_vqsdny.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727330805/Screenshot_2024-09-26_at_07-06-23_Liseen_ejogdd.png'
		]
	},
	{
		name: 'kbar-svelte-mini',
		stack: ['svelte'],
		description: 'Svelte NPM package for setting up cmdk menu on your website',
		image: '$lib/static/images/edit.jpg',
		links: {
			study: 'https://github.com/Abdulmumin1/edit',
			page: 'kbar-mini.vercel.app'
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
		stack: ['Svelte', 'Tailwindcss', 'Supabase', 'Javascript'],
		description: 'Habit tracking app with passkeys integration',
		links: {
			study: 'https://github.com/Abdulmumin1/habitud',
			page: 'habitud.vercel.app'
		},
		color: 'bg-orange-200',
		imagelist: [
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331162/Screenshot_2024-09-26_at_07-12-00_x1f24k.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331162/Screenshot_2024-09-26_at_07-12-15_z70y7k.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727331163/Screenshot_2024-09-26_at_07-12-24_vg8wlf.png'
		]
	},

	{
		name: 'Drop',
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
		stack: ['Vanillajs', 'TailwindCSS', 'HTML'],
		description: 'A Progressive Wep App to edit and frame screenshots beautifully',
		image: '$lib/static/images/edit.jpg',
		links: {
			study: 'https://github.com/Abdulmumin1/edit',
			page: 'editss.vercel.app'
		},
		color: 'bg-white',
		imagelist: [
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328524/Screenshot_2024-09-25_at_14-47-23_Edit_l5zvat.png',
			'https://res.cloudinary.com/dtrqaqezs/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1727328524/Screenshot_2024-09-25_at_14-47-33_Edit_fpyevx.png'
		]
	},
	{
		name: 'BrainTime',
		stack: ['Python', 'CSS2', 'PyQt5'],
		description: 'Excell in you thinking ability with curated brain exercises',
		links: {
			study: '',
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
	}
]);

export const project_data_main = readable([
	{
		name: 'DevCanvas',
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
		stack: ['Svelte', 'Tailwindcss', 'Supabase', 'Javascript'],
		description: 'Habit tracking app with passkeys integration',
		links: {
			study: 'https://github.com/Abdulmumin1/habitud',
			page: 'https://habitud.vercel.app'
		},
		color: 'bg-orange-200'
	},

	{
		name: 'Drop',
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
		stack: ['Vanillajs', 'TailwindCSS', 'HTML'],
		description: 'A Progressive Wep App to edit and frame screenshots beautifully',
		image: '$lib/static/images/edit.jpg',
		links: {
			study: 'https://github.com/Abdulmumin1/edit',
			page: 'https://editss.vercel.app'
		},
		color: 'bg-white'
	},
	{
		name: 'TCP Chat 2',
		stack: ['Python', 'PyQT5', 'SQLite3', 'HTML', 'CSS'],
		description:
			'An extenstion of the commandline tcp chat, with desktop interface, notifications and markdown messages! ',
		links: {
			study: '',
			page: 'https://github.com/Abdulmumin1/ChatDesktopApp'
		}
	},
	{
		name: 'Braintime',
		stack: ['Python', 'CSS3', 'PyQt5'],
		description: 'Excell in you thinking ability with curated brain exercises',
		links: {
			study: '',
			page: '/braintime'
		}
	},
	{
		name: 'Data Prison (Mobile)',
		stack: ['Python', 'Kivy', 'KivyMD', 'SQLite3'],
		description: 'A secure mobile app to save passowrds built with python kivymd and sqlite3',
		links: {
			study: '',
			page: 'https://github.com/Abdulmumin1/DataPrison-mobile-'
		}
	},
	{
		name: 'Data Prison (Desktop)',
		stack: ['Python', 'PyQT5', 'SQLite3'],
		description: 'A secure desktop app to save passowrds built with python pyqt5 and sqlite3.',
		links: {
			study: '',
			page: 'https://github.com/Abdulmumin1/dataprison/'
		}
	}
]);
