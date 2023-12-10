import { readable } from 'svelte/store';

export const project_data = readable([
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
		name: 'DevCanvas',
		stack: ['Svelte', 'Tailwindcss', 'Supabase', 'Javascript'],
		description: 'Online Code Canvas, to paint, build and share built htmt/css/js creations',
		links: {
			study: 'https://github.com/Abdulmumin1/snippets',
			page: 'https://snippet-bice.vercel.app'
		},
		color: 'bg-sky-400'
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
