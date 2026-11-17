import { error } from '@sveltejs/kit';
import { env } from 'cloudflare:workers';

async function reachGuestbook(request) {
	const namespace = env.GUESTBOOK;
	if (!namespace) error(503, 'The guestbook is waking up. Please try again in a moment.');
	const stub = namespace.get(namespace.idFromName('the-garden'));

	if (request.method === 'GET') return stub.fetch('https://guestbook.internal/');

	return stub.fetch('https://guestbook.internal/', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(await request.json())
	});
}

export async function GET({ request }) {
	const response = await reachGuestbook(request);
	return Response.json(await response.json(), { status: response.status });
}

export async function POST({ request }) {
	const response = await reachGuestbook(request);
	return Response.json(await response.json(), { status: response.status });
}
