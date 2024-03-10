import { readable } from 'svelte/store';

export const project_data = readable([
	{
		name: 'DevCanvas',
		stack: ['Svelte', 'Tailwindcss', 'Supabase', 'Javascript'],
		description: 'Online Code Editor, to paint, build and share cool html/css/js creations',
		links: {
			study: 'https://github.com/Abdulmumin1/devcanvas',
			page: 'devcanvas.art'
		},
		color: 'bg-sky-400'
	},

	{
		name: 'Kbar-svelte-mini',
		stack: ['svelte'],
		description: 'Svelte NPM package for setting up cmdk menu on your website',
		image: '$lib/static/images/edit.jpg',
		links: {
			study: 'https://github.com/Abdulmumin1/edit',
			page: 'kbar-mini.vercel.app'
		},
		color: 'bg-white'
	},
	{
		name: 'Habitud',
		stack: ['Svelte', 'Tailwindcss', 'Supabase', 'Javascript'],
		description: 'Habit tracking app with passkeys integration',
		links: {
			study: 'https://github.com/Abdulmumin1/habitud',
			page: 'habitud.vercel.app'
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
			page: 'github.com/Abdulmumin1/drop'
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
			page: 'editss.vercel.app'
		},
		color: 'bg-white'
	}

	// {
	// 	name: 'Neuro Odyssey',
	// 	stack: ['Python', 'CSS3', 'PyQt5'],
	// 	description: 'Excell in you thinking ability with curated brain exercises',
	// 	links: {
	// 		study: '',
	// 		page: '/neuroodyssey'
	// 	}
	// }
]);

export const project_data_main = readable([
	{
		name: 'DevCanvas',
		stack: ['Svelte', 'Tailwindcss', 'Supabase', 'Javascript'],
		description: 'Online Code Editor, to paint, build and share cool html/css/js creations',
		links: {
			study: 'https://github.com/Abdulmumin1/devCanvas',
			page: 'devcanvas.art'
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
			page: 'https://github.com/Abdulmumin1/drop'
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
		name: 'Neuro Odyssey',
		stack: ['Python', 'CSS3', 'PyQt5'],
		description: 'Excell in you thinking ability with curated brain exercises',
		links: {
			study: '',
			page: '/neuroodyssey'
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
