// // import { error } from '@sveltejs/kit';

export const prerender = false;

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, url, depends }) {
	const page = parseInt(url.searchParams.get('page')) || 1;
	const response = await fetch(`blog/api/posts?page=${page}`);
	const data = await response.json();
	return data;
	// throw error(404, 'Not found');
}
