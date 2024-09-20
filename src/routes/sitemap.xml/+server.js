export async function GET({ fetch, url }) {
	const response = await fetch('blog/api/posts');
	const posts = await response.json();
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
  <url>
    <loc>https://www.yaqeen.me</loc>
  </url>
  <url>
    <loc>https://www.yaqeen.me/about</loc>
    <lastmod>2024-01-17</lastmod>
  </url>
  <url>
    <loc>https://www.yaqeen.me/blog</loc>
  </url>
 
  <url>
    <loc>https://www.yaqeen.me/neuroodyssey</loc>
    <lastmod>2024-01-17</lastmod>
  </url>
  <url>
    <loc>https://www.yaqeen.me/projects</loc>
    <lastmod>2024-01-17</lastmod>
  </url>
  <url>
    <loc>https://www.yaqeen.me/wallpapers</loc>
    <lastmod>2024-01-17</lastmod>
  </url>
    ${posts
			.map(
				(post) => `
            <url>
               
                <loc>https://www.yaqeen.me/blog/${post.slug}</loc>
                <lastmod>${post?.lastmod || new Date()}</lastmod>
            </url>
        `
			)
			.join('')}
    </urlset>`.trim();
	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
