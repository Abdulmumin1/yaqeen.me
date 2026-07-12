import { getAllPosts, getPinnedPosts, getRegularPosts } from '$lib/utils/blogPosts.js';

export const prerender = false;

/** @type {import('./$types').PageLoad} */
export function load() {
	const allPosts = getAllPosts();
	const pinnedPosts = getPinnedPosts(allPosts);
	const regularPosts = getRegularPosts(allPosts);

	return { pinnedPosts, regularPosts, allPosts };
}
