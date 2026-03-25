/** @type {import('./$types').PageLoad} */
async function load() {
	throw redirect(302, '/projects');
}
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	throw redirect(308, '/projects');
}
