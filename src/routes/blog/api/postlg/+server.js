import { json } from '@sveltejs/kit';
import { getAllPosts } from '$lib/utils/blogPosts.js';

export async function GET() {
	return json(getAllPosts().slice(0, 11));
}
