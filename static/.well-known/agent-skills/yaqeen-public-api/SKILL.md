# yaqeen-public-api

Use yaqeen.me's public machine-readable endpoints when you need structured access to the site's published writing and service metadata.

## Endpoints

- `GET /blog/api/posts?page=1&limit=43` returns the full published post collections plus pagination metadata.
- `GET /blog/api/postlg` returns the latest 11 published posts.
- `GET /.well-known/api-catalog` returns an RFC 9727 API catalog.
- `GET /.well-known/openapi.json` returns an OpenAPI description of the public endpoints.
- `GET /docs/api` returns markdown API documentation.
- `GET /healthz` returns a lightweight health response.

## Guidance

- Prefer `canonicalUrl` when present.
- Treat the endpoints as read-only public discovery interfaces.
- No authentication is required for the current public endpoints.
