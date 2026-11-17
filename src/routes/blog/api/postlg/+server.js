import { getAllPosts } from '#lib/utils/blogPosts.js';

export async function GET() {
	return Response.json(getAllPosts().slice(0, 11));
}
