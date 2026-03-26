import { siteOrigin } from '$lib/js/config.js';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	return new Response(
		`User-agent: *
Allow: /

# Google adsbot ignores robots.txt unless specifically named!
User-agent: AdsBot-Google
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Disallow: /


Sitemap: ${siteOrigin}/sitemap.xml
    `.trim(),
		{
			headers: {
				'Content-Type': 'text/plain; charset=utf-8'
			}
		}
	);
}
