import { htmlToMarkdown } from 'h-to-md';

import {
	acceptsMarkdown,
	addDiscoveryHeaders,
	addVaryHeader,
	estimateMarkdownTokens
} from '$lib/server/agent-discovery.js';

function cloneResponse(response) {
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
}

export async function handle({ event, resolve }) {
	const response = await resolve(event);
	const isHtmlResponse = response.headers.get('content-type')?.startsWith('text/html');

	if (!isHtmlResponse) {
		return response;
	}

	const nextResponse = cloneResponse(response);
	addVaryHeader(nextResponse.headers, 'Accept');

	if (event.url.pathname === '/') {
		addDiscoveryHeaders(nextResponse.headers);
	}

	if (!acceptsMarkdown(event.request.headers.get('accept')) || event.request.method !== 'GET') {
		return nextResponse;
	}

	const html = await response.text();
	const markdown = htmlToMarkdown(html, {
		baseUrl: event.url.href
	});
	const headers = new Headers(nextResponse.headers);

	headers.delete('content-length');
	headers.delete('etag');
	headers.delete('link');
	headers.set('content-type', 'text/markdown; charset=utf-8');
	headers.set('x-markdown-tokens', String(estimateMarkdownTokens(markdown)));

	if (event.url.pathname === '/') {
		addDiscoveryHeaders(headers);
	}

	return new Response(markdown, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}
