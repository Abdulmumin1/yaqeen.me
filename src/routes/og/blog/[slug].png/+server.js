import { error } from '@sveltejs/kit';
import { postCard } from '$lib/server/og/postCard.js';

/**
 * A post's link preview, /og/blog/<slug>.png, drawn on the first request.
 * The post page asks for it with ?v=, which changes whenever the title or the
 * date does, so a response for one version can be kept for good: the worker
 * caches it (adapter-cloudflare keeps anything marked public) and so does
 * whoever unfurls the link.
 */
export async function GET({ params, url }) {
	let metadata;
	try {
		({ metadata } = await import(`../../../blog/posts/${params.slug}.md`));
	} catch {
		error(404, `No post called ${params.slug}`);
	}
	if (!metadata?.published) error(404, `No post called ${params.slug}`);

	return postCard(
		{ slug: params.slug, title: metadata.title, date: metadata.date },
		{
			'Cache-Control': url.searchParams.has('v')
				? 'public, max-age=31536000, immutable'
				: 'public, max-age=86400'
		}
	);
}
