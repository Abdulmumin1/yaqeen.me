import { json } from '@sveltejs/kit';
import matter from 'gray-matter';

async function getPosts(series) {
	const allFiles = import.meta.glob('/src/routes/blog/posts/**/*.md', {
		as: 'raw'
	});

	let posts = [];
	let about = null;

	for (const [filePath, load] of Object.entries(allFiles)) {
		const content = await load();
		const parsed = matter(content);

		// Extract series and filename from path
		const parts = filePath.split('/');
		const fileName = parts.at(-1);
		const fileSeries = parts.at(-2);

		// Only include if matches the requested series
		if (fileSeries !== series) continue;

		const slug = fileName.replace('.md', '');

		if (slug === 'about') {
			about = parsed;
			continue;
		}

		if (parsed.data?.published) {
			posts.push({ ...parsed.data, slug });
		}
	}

	// Optional sort
	posts.sort((a, b) => new Date(b.date) - new Date(a.date));

	return { posts, about };
}

export async function GET({ url }) {
	const series = url.searchParams.get('series');
	if (!series) return json({ error: 'Missing series parameter' }, { status: 400 });

	const { posts } = await getPosts(series);
	return json(posts);
}
