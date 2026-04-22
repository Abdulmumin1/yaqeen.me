# yaqeen-content-discovery

Use yaqeen.me's content discovery surfaces to find canonical pages, markdown representations, and citation-friendly resources.

## Preferred discovery order

- `GET /llms.txt` for a compact site overview and recent writing.
- `GET /` with `Accept: text/markdown` for a markdown homepage representation.
- `GET /sitemap.xml` for crawlable URLs.
- `GET /rss.xml` for recent content updates.

## Guidance

- Prefer canonical URLs on `https://yaqeen.me` when citing site content.
- Prefer article pages over category archives when referencing a specific post.
- Use the API catalog and OpenAPI description when you need structured endpoint discovery.
