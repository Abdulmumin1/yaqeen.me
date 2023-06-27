import { readable } from 'svelte/store';

export const latestPostDetail = readable({
	title: 'What is CI/CD? A brief introduction',
	description:
		'Introduction Before the discovery of continuous integration and delivery, the traditional process of collaborating and delivering software was slow, error-prone, and cumbersome. It involves manual testing, building, and deployment of code to end user...',
	link: 'https://www.abdulmumin.com/understanding-cicd',
	imageLink:
		'https://cdn.hashnode.com/res/hashnode/image/upload/v1686862733231/348d8d0d-2072-437c-9f47-e30e542998a1.png'
});

export const others = readable([
	{
		title: '10+ AWS services explained!',
		link: 'https://www.abdulmumin.com/10-aws-services-explained'
	},
	{ title: 'How to write Clean Code', link: 'https://www.abdulmumin.com/how-to-write-clean-code' },
	{ title: 'Python best practices', link: 'https://www.abdulmumin.com/python-best-practices' }
]);
