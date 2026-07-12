import { error, json } from '@sveltejs/kit';

async function reachGuestbook(platform, request) {
	const namespace = platform?.env?.GUESTBOOK;
	if (!namespace) error(503, 'The guestbook is waking up. Please try again in a moment.');
	const stub = namespace.get(namespace.idFromName('the-garden'));

	if (request.method === 'GET') return stub.fetch('https://guestbook.internal/');

	return stub.fetch('https://guestbook.internal/', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(await request.json())
	});
}

export async function GET({ platform, request }) {
	const response = await reachGuestbook(platform, request);
	return json(await response.json(), { status: response.status });
}

export async function POST({ platform, request }) {
	const response = await reachGuestbook(platform, request);
	return json(await response.json(), { status: response.status });
}
