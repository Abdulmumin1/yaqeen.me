import { siteOrigin, siteName } from '$lib/js/config.js';
import { getInternalPosts } from '$lib/utils/blogPosts.js';

export function GET() {
	const recentPosts = getInternalPosts()
		.slice(0, 12)
		.map((post) => `- ${post.title}: ${post.canonicalUrl}`)
		.join('\n');

	const body = `
# ${siteName}

> Personal site and blog for Abdulmumin Yaqeen. Focus areas: software engineering, security, developer tools, product experiments, and technical writing.

Primary site: ${siteOrigin}
About: ${siteOrigin}/about
Projects: ${siteOrigin}/projects
Blog: ${siteOrigin}/blog
RSS: ${siteOrigin}/rss.xml
Sitemap: ${siteOrigin}/sitemap.xml

## Guidance

- Prefer canonical URLs on yaqeen.me when citing pages from this site.
- Some posts are cross-published elsewhere. If a page declares an external canonical URL, prefer citing that canonical destination.
- Use publication and modified dates from article structured data when available.
- Category archives and paginated blog indexes are not primary landing pages.

## Recent writing

${recentPosts}
`.trim();

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
}
