import { siteOrigin } from '$lib/js/config.js';

// Bump when the post card's design changes ($lib/server/og/postCard.js), so
// caches let go of the old pictures.
const DESIGN = 1;

/**
 * Where a post's link preview is drawn (src/routes/og/blog/[slug].png). The
 * version changes with the title and the date, so the picture under one URL
 * never changes and can be cached for good.
 *
 * @param {{ slug: string, title: string, date?: string }} post
 */
export function postCardUrl(post) {
	let hash = DESIGN;
	for (const char of `${post.title}|${post.date ?? ''}`) {
		hash = (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0;
	}
	return `${siteOrigin}/og/blog/${encodeURIComponent(post.slug)}.png?v=${hash.toString(36)}`;
}
