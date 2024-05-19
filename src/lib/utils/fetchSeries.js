// import { error } from '@sveltejs/kit';

function filterObjectsByTagKey(objects, tagKey, query) {
	return objects.filter((object) => {
		// Ensure case-insensitive matching and handle potential undefined values:
		return object?.[tagKey] === query.toLowerCase();
	});
}

export async function fetchSeries(series) {
	const response = await fetch('/blog/api/posts');
	let posts = await response.json();
	// console.log(posts);
	// console.log(params.slug);
	posts = filterObjectsByTagKey(posts, 'series', series);
	// console.log(posts);
	return { posts };
	// throw error(404, 'Not found');
}
