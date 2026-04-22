import { estimateMarkdownTokens, getApiDocsMarkdown } from '$lib/server/agent-discovery.js';

export function GET() {
	const body = getApiDocsMarkdown();

	return new Response(body, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'x-markdown-tokens': String(estimateMarkdownTokens(body))
		}
	});
}
