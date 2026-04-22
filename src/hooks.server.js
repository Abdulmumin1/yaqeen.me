import { addDiscoveryHeaders, addVaryHeader } from '$lib/server/agent-discovery.js';

function cloneResponse(response) {
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
}

export async function handle({ event, resolve }) {
	const response = await resolve(event);

	if (event.url.pathname !== '/') {
		return response;
	}

	const nextResponse = cloneResponse(response);
	addVaryHeader(nextResponse.headers, 'Accept');
	addDiscoveryHeaders(nextResponse.headers);

	return nextResponse;
}
