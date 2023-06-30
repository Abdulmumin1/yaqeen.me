import { json } from '@sveltejs/kit';

async function getPosts() {
	let posts = [];
	const paths = import.meta.glob('../../posts/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		let slug = path.split('/').at(-1)?.replace('.md', '');

		const metadata = file.metadata;
		const post = { ...metadata, slug };
		post.published && posts.push(post);
	}

	posts = posts.sort((f, s) => {
		new Date(s.date).getTime() - new Date(f.date).getTime();
	});
	return posts;
}
export async function GET() {
	const posts = await getPosts();
	return json(posts);
}
