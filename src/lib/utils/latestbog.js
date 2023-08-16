import { readable } from 'svelte/store';

export const latestPostDetail = readable({
	title: 'Things Svelte just do better!',
	description:
		"In the world of javascript, React dominates. It just feels like where ever you go on its map, React is just there, you really can't escape encountering it everywhere you turn. It makes sense though, because when it was created, it was the most revolutionary, and so many adopted it, causing even frontend to sound like you're saying React!...",
	link: 'https://www.abdulmumin.com/things-svelte-just-do-better',
	imageLink:
		'https://cdn.hashnode.com/res/hashnode/image/upload/v1692090552577/30933fc0-c9d7-4a29-a1cd-6a68f494a6c7.png'
});

export const others = readable([
	{
		title: 'How to use TailwindCSS in any Python project',
		link: 'https://www.abdulmumin.com/how-to-use-tailwindcss-in-any-python-project'
	},
	{
		title: '10+ AWS services explained!',
		link: 'https://www.abdulmumin.com/10-aws-services-explained'
	},
	{ title: 'Python best practices', link: 'https://www.abdulmumin.com/python-best-practices' }
]);
