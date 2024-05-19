import { json } from '@sveltejs/kit';
import fs from 'node:fs/promises';
import path from 'node:path';

// import matter from 'gray-matter';

async function getPosts(series) {
	let posts = [];
	// const paths = import.meta.glob(`../../posts/${series}/*.md`);
	// const posts: Post[] = []
	const postPath = path.resolve(`src/routes/blog/posts/${series}`);
	const paths = await fs.readdir(postPath);
	console.log(paths);

	const aboutFilePath = path.join(postPath, `about.md`);
	const aboutContent = await fs.readFile(aboutFilePath, 'utf-8');

	const about = matter(aboutContent);

	for (const pathd in paths.filter((p) => p !== 'about.md')) {
		// const file = paths[path];
		// let slug = path.split('/').at(-1)?.replace('.md', '');
		// const metadata = file.metadata;
		// const post = { ...metadata, slug };
		// post.published && posts.push(post);
	}

	// posts = posts.sort(
	// 	(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	// );

	return [];
}
export async function GET({ url }) {
	let series = url.searchParams.get('series');
	// console.log(series, 'some thing es');
	const posts = await getPosts(series);
	return json(posts);
}
