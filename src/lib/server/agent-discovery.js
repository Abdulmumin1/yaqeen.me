import { siteName, siteOrigin } from '$lib/js/config.js';

const apiCatalogProfile = 'https://www.rfc-editor.org/info/rfc9727';

function absolute(pathname) {
	return new URL(pathname, siteOrigin).toString();
}

export const discoveryLinkDefinitions = [
	{
		href: '/.well-known/api-catalog',
		rel: 'api-catalog',
		type: 'application/linkset+json'
	},
	{
		href: '/.well-known/openapi.json',
		rel: 'service-desc',
		type: 'application/vnd.oai.openapi+json'
	},
	{
		href: '/docs/api',
		rel: 'service-doc',
		type: 'text/markdown'
	},
	{
		href: '/llms.txt',
		rel: 'describedby',
		type: 'text/plain'
	}
];

export const agentSkills = [
	{
		name: 'yaqeen-public-api',
		type: 'skill-md',
		description: 'Use the public blog and discovery endpoints for machine-readable site access.',
		url: absolute('/.well-known/agent-skills/yaqeen-public-api/SKILL.md'),
		digest: 'sha256:699a57ccd887e9ae70fa95fccc2faec5c41d16e4dd022d50a859ad92ce690420'
	},
	{
		name: 'yaqeen-content-discovery',
		type: 'skill-md',
		description:
			'Discover canonical pages, markdown views, and citation-friendly content on yaqeen.me.',
		url: absolute('/.well-known/agent-skills/yaqeen-content-discovery/SKILL.md'),
		digest: 'sha256:b97049d740ecc507080278c243933f3f97338feb4d67f743c78d58bcf0cce8cd'
	}
];

export const publicApis = [
	{
		path: '/blog/api/posts',
		summary: 'Returns published blog post collections and pagination metadata.',
		parameters: [
			'page: optional page number for archived posts, defaults to 1.',
			'limit: optional archive page size, defaults to 43.'
		]
	},
	{
		path: '/blog/api/postlg',
		summary: 'Returns the latest 11 published posts.',
		parameters: []
	},
	{
		path: '/healthz',
		summary: 'Returns a lightweight health check for the public site endpoints.',
		parameters: []
	}
];

export function acceptsMarkdown(acceptHeader = '') {
	return String(acceptHeader ?? '')
		.split(',')
		.map((value) => value.trim())
		.some((value) => {
			if (!value) {
				return false;
			}

			const [mediaType, ...parameters] = value.split(';').map((part) => part.trim());
			if (mediaType !== 'text/markdown') {
				return false;
			}

			const quality = parameters.find((parameter) => parameter.startsWith('q='));
			if (!quality) {
				return true;
			}

			const parsed = Number.parseFloat(quality.slice(2));
			return Number.isNaN(parsed) || parsed > 0;
		});
}

export function estimateMarkdownTokens(markdown) {
	return Math.max(1, Math.ceil(markdown.length / 4));
}

export function addDiscoveryHeaders(headers) {
	for (const link of discoveryLinkDefinitions) {
		headers.append('Link', `<${link.href}>; rel="${link.rel}"; type="${link.type}"`);
	}
}

export function addVaryHeader(headers, value) {
	const current = headers.get('Vary');
	if (!current) {
		headers.set('Vary', value);
		return;
	}

	const parts = current
		.split(',')
		.map((part) => part.trim())
		.filter(Boolean);

	if (!parts.some((part) => part.toLowerCase() === value.toLowerCase())) {
		parts.push(value);
		headers.set('Vary', parts.join(', '));
	}
}

export function getApiDocsMarkdown() {
	return `# ${siteName} Public API

Public machine-readable endpoints for content discovery and health checks.

## Base URL

- ${siteOrigin}

## Authentication

- No authentication is required for the current public endpoints in this document.

## Endpoints

${publicApis
	.map((api) => {
		const parameterLines = api.parameters.length
			? api.parameters.map((parameter) => `- ${parameter}`).join('\n')
			: '- No query parameters.';

		return `### GET ${api.path}

${api.summary}

Parameters:
${parameterLines}`;
	})
	.join('\n\n')}

## Discovery

- API catalog: ${siteOrigin}/.well-known/api-catalog
- OpenAPI: ${siteOrigin}/.well-known/openapi.json
- llms.txt: ${siteOrigin}/llms.txt
`.trim();
}

export function getApiCatalogDocument() {
	const serviceDesc = {
		href: absolute('/.well-known/openapi.json'),
		type: 'application/vnd.oai.openapi+json'
	};
	const serviceDoc = {
		href: absolute('/docs/api'),
		type: 'text/markdown'
	};
	const status = {
		href: absolute('/healthz'),
		type: 'application/json'
	};

	return {
		linkset: publicApis.map((api) => ({
			anchor: absolute(api.path),
			'service-desc': [serviceDesc],
			'service-doc': [serviceDoc],
			status: [status]
		}))
	};
}

export function getOpenApiDocument() {
	return {
		openapi: '3.1.0',
		info: {
			title: `${siteName} Public API`,
			version: '1.0.0',
			description: 'Public discovery and content endpoints for yaqeen.me.'
		},
		servers: [
			{
				url: siteOrigin
			}
		],
		paths: {
			'/blog/api/posts': {
				get: {
					summary: 'List published blog posts',
					description: 'Returns pinned, regular, archive, and paginated blog post collections.',
					parameters: [
						{
							name: 'page',
							in: 'query',
							description: 'Archive page number.',
							schema: {
								type: 'integer',
								minimum: 1,
								default: 1
							}
						},
						{
							name: 'limit',
							in: 'query',
							description: 'Archive page size.',
							schema: {
								type: 'integer',
								minimum: 1,
								default: 43
							}
						}
					],
					responses: {
						200: {
							description: 'Published blog post collections.',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											latest: {
												oneOf: [{ $ref: '#/components/schemas/Post' }, { type: 'null' }]
											},
											latestRegular: {
												oneOf: [{ $ref: '#/components/schemas/Post' }, { type: 'null' }]
											},
											allPosts: {
												type: 'array',
												items: { $ref: '#/components/schemas/Post' }
											},
											pinnedPosts: {
												type: 'array',
												items: { $ref: '#/components/schemas/Post' }
											},
											regularPosts: {
												type: 'array',
												items: { $ref: '#/components/schemas/Post' }
											},
											archivePosts: {
												type: 'array',
												items: { $ref: '#/components/schemas/Post' }
											},
											posts: {
												type: 'array',
												items: { $ref: '#/components/schemas/Post' }
											},
											totalPosts: { type: 'integer' },
											totalPages: { type: 'integer' },
											currentPage: { type: 'integer' },
											hasNext: { type: 'boolean' },
											hasPrev: { type: 'boolean' }
										},
										required: [
											'allPosts',
											'pinnedPosts',
											'regularPosts',
											'archivePosts',
											'posts',
											'totalPosts',
											'totalPages',
											'currentPage',
											'hasNext',
											'hasPrev'
										]
									}
								}
							}
						}
					}
				}
			},
			'/blog/api/postlg': {
				get: {
					summary: 'List latest posts',
					description: 'Returns the latest 11 published posts.',
					responses: {
						200: {
							description: 'Latest published posts.',
							content: {
								'application/json': {
									schema: {
										type: 'array',
										items: { $ref: '#/components/schemas/Post' }
									}
								}
							}
						}
					}
				}
			},
			'/healthz': {
				get: {
					summary: 'Health check',
					responses: {
						200: {
							description: 'Public endpoint health status.',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											status: { type: 'string', enum: ['ok'] },
											service: { type: 'string' }
										},
										required: ['status', 'service']
									}
								}
							}
						}
					}
				}
			}
		},
		components: {
			schemas: {
				Post: {
					type: 'object',
					properties: {
						title: { type: 'string' },
						description: { type: 'string' },
						slug: { type: 'string' },
						href: { type: 'string' },
						canonicalUrl: { type: 'string' },
						date: { type: 'string' },
						lastmod: { type: 'string' },
						isExternal: { type: 'boolean' },
						pinned: { type: 'boolean' }
					},
					additionalProperties: true
				}
			}
		}
	};
}

export function getApiCatalogContentType() {
	return `application/linkset+json; profile="${apiCatalogProfile}"; charset=utf-8`;
}
