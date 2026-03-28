import { json } from '@sveltejs/kit';
import { getAllPosts } from '$lib/utils/blogPosts.js';

export async function GET({ url }) {
	const allPosts = getAllPosts();
	const latest = allPosts[0] ?? null;
	const archivePosts = allPosts.slice(1);
	const limit = parseInt(url.searchParams.get('limit')) || 21;
	const page = parseInt(url.searchParams.get('page')) || 1;
	const totalPosts = archivePosts.length;
	const totalPages = Math.max(1, Math.ceil(totalPosts / limit));

	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const paginatedPosts = archivePosts.slice(startIndex, endIndex);

	return json({
		latest,
		allPosts,
		archivePosts,
		posts: paginatedPosts,
		totalPosts,
		totalPages,
		currentPage: page,
		hasNext: page < totalPages,
		hasPrev: page > 1
	});
}
