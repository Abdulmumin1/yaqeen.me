import { json } from '@sveltejs/kit';
import matter from 'gray-matter';

async function getPosts(series) {
	const allFiles = import.meta.glob(`/src/routes/blog/posts/${series}/*.md`, {
		as: 'raw',
	});

	let posts = [];
	let about = null;

	for (const [path, loader] of Object.entries(allFiles)) {
		const content = await loader();
		const parsed = matter(content);

		const slug = path
			.split('/')
			.at(-1)
			.replace('.md', '');

		if (slug === 'about') {
			about = parsed;
			continue;
		}

		if (parsed.data.published) {
			posts.push({ ...parsed.data, slug });
		}
	}

	// Optional: Sort posts by date
	posts.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	return { posts, about };
}

export async function GET({ url }) {
	const series = url.searchParams.get('series');
	const { posts } = await getPosts(series);
	return json(posts);
}
