---
title: 'Simple SEO optimization for your Sveltekit website'

description: 'So, the first thing we’re going to tackle is the robots.txt file, this file tells the search engine crawlers which part of your site it should be crawled or not. A robots.txt file is used primarily to manage crawler traffic to your site, and usually to keep a file off Google.'

date: '2024-02-04'

lastmod: '2024-02-04'

categories:
  - sveltekit
  - tips
  - seo

visual: false

published: true
---

Recently I’ve been putting a lot of work into SEO for my blog and also that of [devcanvas](http://devcanvas.art/blog), but I then realized a big problem, most of my pages are not even on google yet. This is indeed a very huge problem.

I then come to realize my website needs the `sitemap.xml` so Google can index them faster, and also a `robots.txt`. These makes the discovery and indexing process faster and more efficient.

I thought It would be cool to share other like me, a simple method to step up your SEO game.

My first thought was we can have TXT files or XML files as route in Sveltekit, turned out I was thinking the wrong way and the solution is much more simpler.

So, the first thing we’re going to tackle is the `robots.txt` file, this file tells the search engine crawlers which part of your site it should be crawled or not. A `robots.txt` file is used primarily to manage crawler traffic to your site, and _usually_ to keep a file off Google.

The way we’re going to create this `robots.txt` file for our Sveltekit website is by using endpoints. This will allow us to return a text response when ever the route is requested.

> Create a `robots.txt` folder in your routes, and place the `+server.js` inside of it, so it looks something like this - `routes/robots.txt/+server.js`

```js
/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	return new Response(
		`User-agent: *
Allow: /

# Google adsbot ignores robots.txt unless specifically named!
User-agent: AdsBot-Google
Allow: /


User-agent: GPTBot
Disallow: /
`.trim()
	);
}
```

You can follow the steps [here](https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt) to submit your robots.txt file. Though it does not make any difference as the search engine will automatically pick it up.

Having the `robots.txt` file alone does not mean the search engine crawler understands your website, instead it more like a signal to allow or disallow search engine crawlers to crawl or not part of our website. Also, we will have to update our robots.txt with our sitemap when we create it.

As you can see in the `robots.txt`, we’re are blocking the `GPTBot` from crawling our website, it probably does not have much effect, but it good to have.

**Sitemap;**

A sitemap enable search engine crawlers to find pages that are present in your website, which changed and when, so it can index your site accordingly.

A sitemap is structured in an `XML` format, and defines, or just as the name suggest, provide the search engine with a map of your website, allowing search engine crawlers to find pages faster and more efficiently.

> Create a `sitemap.xml` folder in your routes, and place the `+server.js` inside of it, so it looks something like this - `routes/sitemap.xml/+server.js`

```js
export async function GET() {
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
  <loc>https://yaqeen.me</loc>
</url>
<url>
  <loc>https://yaqeen.me/about</loc>
  <lastmod>2024-01-17</lastmod>
</url>
<url>
  <loc>https://yaqeen.me/blog</loc>
</url>
<url>
  <loc>https://yaqeen.me/projects</loc>
  <lastmod>2024-01-17</lastmod>
</url>
<url>
  <loc>https://yaqeen.me/wallpapers</loc>
  <lastmod>2024-01-17</lastmod>
</url>
</urlset>`.trim();
	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
```

This is what a simple sitemap looks like, it basically the URLs in your website.

> Note we’re are returning a response with a Content-Type of `application/xml`. It is very important so your response won’t be returned a plain text.

We can then finally update our robots.txt file to point to our sitemap.

```js
/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	return new Response(
		`User-agent: *
Allow: /

# Google adsbot ignores robots.txt unless specifically named!
User-agent: AdsBot-Google
Allow: /


User-agent: GPTBot
Disallow: /

Sitemap: ${url.origin}/sitemap.xml
`.trim()
	);
}
```

Notice that we’re using `url.origin`, this is just to make it easier for us when we’re updating maybe our domain or we’re in dev mode, we don’t have to manage that.

**Tip;**

In my website, I have a blog, and I need to be able to dynamically update the sitemap. I think most of us can agree it no easy task to do this manually for all your pages.

One trick I’m using here is, in my sitemap:

1. Fetch all the blog posts.
2. use the map function to automatically add the blog URLs to the XML.

**Example;**

```js
export async function GET({ fetch, url }) {
	const response = await fetch('blog/get/posts/all');
	const posts = await response.json();
	const xml = `
        <!-- Rest of the site map -->
        <url>
          <loc>https://yaqeen.me</loc>
        </url>

        <!-- Rest of the site map -->

        ${posts.map((post) => `
          <url>
            <loc>${url.origin}/blog/${post.slug}</loc>
            <lastmod>${post?.lastmod}</lastmod>
          </url>
            `).join('')}
        </urlset>`.trim();
        
	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
```

I use this method on this blog and it works like magic. You could use similar method for your websites as well.

**Peace** ✌️
