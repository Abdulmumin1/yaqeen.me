import { readable } from 'svelte/store';

export const project_data = readable([
	{
		name: 'Snippet',
		stack: ['Svelte', 'Tailwindcss', 'Supabase', 'Javascript'],
		description:
			'Share and discover code snippets for various programming languages and use cases.',
		links: {
			study: 'https://github.com/Abdulmumin1/snippets',
			page: 'https://snippet-bice.vercel.app'
		}
	},
	{
		name: 'Drop',
		stack: ['Qt', 'Flask', 'HTML', 'Socket'],
		description:
			'A fast and secure desktop app that allows you to share files across multiple devices',
		links: {
			study: 'https://github.com/Abdulmumin1/drop',
			page: 'https://github.com/Abdulmumin1/drop'
		}
	},
	{
		name: 'Edit',
		stack: ['Vanillajs', 'TailwindCSS', 'HTML'],
		description: 'Beautifully edit text and images',
		image: '$lib/static/images/edit.jpg',
		links: {
			study: 'https://github.com/Abdulmumin1/edit',
			page: 'https://editss.vercel.app'
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
	}
]);
