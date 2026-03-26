import * as config from '$lib/js/config.js';

export async function GET({ fetch }) {
	const response = await fetch('/blog/api/posts');
	const { allPosts } = await response.json();

	const headers = { 'Content-Type': 'application/rss+xml; charset=utf-8' };

	const xml = `
		<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
			<channel>
				<title>${config.title}</title>
				<description>${config.description}</description>
				<link>${config.url}</link>
				<atom:link href="https://yaqeen.me/rss.xml" rel="self" type="application/rss+xml"/>
				${allPosts
					.map((post) => {
						const link = post.canonicalUrl || new URL(post.href, config.url).toString();

						return `
						<item>
							<title>${post.title}</title>
							<description>${post.description}</description>
							<link>${link}</link>
							<guid isPermaLink="true">${link}</guid>
							<pubDate>${new Date(post.date).toUTCString()}</pubDate>
						</item>
					`;
					})
					.join('')}
			</channel>
		</rss>
	`.trim();

	return new Response(xml, { headers });
}
