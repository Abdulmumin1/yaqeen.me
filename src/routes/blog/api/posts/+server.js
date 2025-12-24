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

	posts = posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);

	return posts;
}
export async function GET({ url }) {
	const posts = await getPosts();
	const latest = posts[0];
	const allPosts = posts.slice(1); // posts without latest
	const limit = parseInt(url.searchParams.get('limit')) || 8;
	const page = parseInt(url.searchParams.get('page')) || 1;
	const totalPosts = allPosts.length;
	const totalPages = Math.ceil(totalPosts / limit);

	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const paginatedPosts = allPosts.slice(startIndex, endIndex);

	return json({
		latest,
		posts: paginatedPosts,
		totalPosts,
		totalPages,
		currentPage: page,
		hasNext: page < totalPages,
		hasPrev: page > 1
	});
}
