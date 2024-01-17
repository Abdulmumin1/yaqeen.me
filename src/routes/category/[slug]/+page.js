// import { error } from '@sveltejs/kit';

function filterObjectsByTagKey(objects, tagKey, query) {
	return objects.filter((object) => {
		// Ensure case-insensitive matching and handle potential undefined values:
		return object?.[tagKey]?.includes(query.toLowerCase());
	});
}

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const response = await fetch('/blog/api/posts');
	let posts = await response.json();
	// console.log(posts);
	posts = filterObjectsByTagKey(posts, 'categories', params.slug);
	return { posts };
	// throw error(404, 'Not found');
}
