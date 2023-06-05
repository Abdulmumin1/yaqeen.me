import { readable } from 'svelte/store';

export const project_data = readable([
	{
		name: 'Drop',
		stack: ['Qt', 'Flask', 'HTML', 'Socket'],
		description:
			'A fast and secure desktop app that allows you to share files across multiple devices'
	},
	{
		name: 'Edit',
		stack: ['Vanillajs', 'TailwindCSS', 'HTML'],
		description: 'Beautifully edit text and images',
		image: '$lib/static/images/edit.jpg'
	},
	{
		name: 'Numbertime',
		stack: ['Python', 'Flask', 'PyQt5'],
		description: 'A math game that helps you exale in your thinking ability'
	},
	{
		name: 'Quix',
		stack: ['Flask', 'Bootstrap', 'HTML', 'Javascript'],
		description: 'A math game that helps you exale in your thinking ability'
	}
]);
