import { getOpenApiDocument } from '$lib/server/agent-discovery.js';

export function GET() {
	return new Response(JSON.stringify(getOpenApiDocument(), null, 2), {
		headers: {
			'Content-Type': 'application/vnd.oai.openapi+json; charset=utf-8'
		}
	});
}
