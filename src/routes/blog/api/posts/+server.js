import { json } from '@sveltejs/kit';
import { getAllPosts, getPinnedPosts, getRegularPosts } from '$lib/utils/blogPosts.js';

export async function GET({ url }) {
	const allPosts = getAllPosts();
	const pinnedPosts = getPinnedPosts(allPosts);
	const regularPosts = getRegularPosts(allPosts);
	const latest = allPosts[0] ?? null;
	const latestRegular = regularPosts[0] ?? null;
	const archivePosts = regularPosts.slice(1);
	const limit = parseInt(url.searchParams.get('limit')) || 43;
	const page = parseInt(url.searchParams.get('page')) || 1;
	const totalPosts = archivePosts.length;
	const totalPages = Math.max(1, Math.ceil(totalPosts / limit));

	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const paginatedPosts = archivePosts.slice(startIndex, endIndex);

	return json({
		latest,
		latestRegular,
		allPosts,
		pinnedPosts,
		regularPosts,
		archivePosts,
		posts: paginatedPosts,
		totalPosts,
		totalPages,
		currentPage: page,
		hasNext: page < totalPages,
		hasPrev: page > 1
	});
}
