const MAX_ENTRIES = 150;

/**
 * The site's single guestbook lives in one Durable Object. Keeping the write
 * path here means the home interaction and the garden never depend on a
 * separate Worker or a client-side realtime SDK.
 */
export class Guestbook {
	constructor(state) {
		this.state = state;
	}

	async fetch(request) {
		if (request.method === 'GET') {
			return Response.json((await this.state.storage.get('entries')) ?? []);
		}

		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		const { name, message, signaturePaths, cardColor } = await request.json();
		const cleanName = typeof name === 'string' ? name.trim().slice(0, 40) : '';
		const cleanMessage = typeof message === 'string' ? message.trim().slice(0, 280) : '';
		const cleanSignaturePaths = Array.isArray(signaturePaths)
			? signaturePaths
					.filter((path) => typeof path === 'string')
					.map((path) => path.trim())
					.filter(Boolean)
					.slice(0, 24)
			: [];
		const cleanCardColor =
			typeof cardColor === 'string' && /^#[0-9a-f]{6}$/i.test(cardColor) ? cardColor : '#cf7b69';

		if (!cleanName || !cleanMessage || cleanSignaturePaths.length === 0) {
			return Response.json(
				{ error: 'A name, a note, and a real signature are all needed.' },
				{ status: 400 }
			);
		}

		const entries = (await this.state.storage.get('entries')) ?? [];
		const entry = {
			id: crypto.randomUUID(),
			name: cleanName,
			message: cleanMessage,
			signaturePaths: cleanSignaturePaths,
			cardColor: cleanCardColor,
			createdAt: new Date().toISOString()
		};

		entries.unshift(entry);
		await this.state.storage.put('entries', entries.slice(0, MAX_ENTRIES));
		return Response.json(entry, { status: 201 });
	}
}
