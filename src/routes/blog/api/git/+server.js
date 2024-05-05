// import { json } from '@sveltejs/kit';
// import { env } from '$env/dynamic/private';
// import matter from 'gray-matter';

// // let env = import.meta.env;

// async function fetchMarkdownFilesWithFrontMatter(repositoryUrl) {
// 	try {
// 		const response = await fetch(repositoryUrl, {
// 			headers: {
// 				Accept: 'application/vnd.github.v4+raw',
// 				Authorization: `Bearer ${env.GITHUB_TOKEN}`
// 			}
// 		});
// 		if (!response.ok) {
// 			throw new Error('Failed to fetch repository contents.');
// 		}
// 		const data = await response.json();
// 		const markdownFiles = data.filter((file) => file.name.endsWith('.md'));

// 		const filePromises = markdownFiles.map(async (file) => {
// 			const fileResponse = await fetch(file.download_url);
// 			if (!fileResponse.ok) {
// 				throw new Error(`Failed to fetch file: ${file.name}`);
// 			}
// 			const fileContent = await fileResponse.text();
// 			const frontMatter = parseFrontMatter(fileContent);
// 			const slug = file.name.replace('.md', '');
// 			return {
// 				// fileName: file.name,
// 				slug: slug,
// 				...frontMatter['data'],
// 				content: frontMatter['content'],
// 				// title: frontMatter['data']['ti/tle']
// 				title: slug
// 			};
// 		});

// 		const filesWithFrontMatter = await Promise.all(filePromises);
// 		return filesWithFrontMatter;
// 	} catch (error) {
// 		console.error(error);
// 		return [];
// 	}
// }

// function parseFrontMatter(fileContent) {
// 	// const frontMatterRegex = /^---\s*\n([\s\S]*?)\n?---\s*\n?([\s\S]*)/;
// 	// const match = fileContent.match(frontMatterRegex);
// 	// if (match && match.length >= 3) {
// 	// 	const frontMatter = match[1].trim();
// 	// 	try {
// 	// 		return JSON.parse(`{${frontMatter}}`);
// 	// 	} catch (e) {
// 	// 		return `{${frontMatter}}`;
// 	// 	}
// 	// } else {
// 	// 	return null;
// 	// }
// 	return matter(fileContent);
// }

// const BASE_GITHUB_URL = `https://api.github.com/repos/${env.GITHUB_USERNAME}/${env.GITHUB_REPOSITORY}/contents`;
// export async function GET() {
// 	console.log(BASE_GITHUB_URL);
// 	const repositoryUrl = BASE_GITHUB_URL;
// 	let files = await fetchMarkdownFilesWithFrontMatter(repositoryUrl);

// 	return json(files);
// }
