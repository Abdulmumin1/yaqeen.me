import {
	addDiscoveryHeaders,
	getApiCatalogContentType,
	getApiCatalogDocument
} from '$lib/server/agent-discovery.js';

export function GET() {
	const body = JSON.stringify(getApiCatalogDocument(), null, 2);
	const headers = new Headers({
		'Content-Type': getApiCatalogContentType()
	});

	addDiscoveryHeaders(headers);

	return new Response(body, { headers });
}
