import { siteOrigin } from '$lib/js/config.js';

export async function GET({ fetch }) {
	const response = await fetch('/blog/api/posts');
	const { allPosts } = await response.json();
	const staticPages = [
		{ loc: siteOrigin },
		{ loc: `${siteOrigin}/about`, lastmod: '2024-01-17' },
		{ loc: `${siteOrigin}/blog` },
		{ loc: `${siteOrigin}/blog/series/uth` },
		{ loc: `${siteOrigin}/projects`, lastmod: '2024-01-17' },
		{ loc: `${siteOrigin}/wallpapers`, lastmod: '2024-01-17' }
	];
	const xml = `
    <?xml version="1.0" encoding="UTF-8" ?>
    <urlset
        xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="https://www.w3.org/1999/xhtml"
        xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
    >
  ${staticPages
		.map(
			(page) => `
  <url>
    <loc>${page.loc}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
  </url>`
		)
		.join('')}
    ${allPosts
			.filter(
				(post) =>
					!post.isExternal && (!post.canonicalUrl || post.canonicalUrl.startsWith(siteOrigin))
			)
			.map(
				(post) => `
            <url>
               
                <loc>${post.canonicalUrl || new URL(post.href, siteOrigin).toString()}</loc>
                <lastmod>${new Date(post?.lastmod || post.date || Date.now()).toISOString()}</lastmod>
            </url>
        `
			)
			.join('')}
    </urlset>`.trim();
	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8'
		}
	});
}
