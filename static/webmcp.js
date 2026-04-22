(function () {
	const modelContext = navigator.modelContext;
	if (!modelContext || typeof modelContext.registerTool !== 'function') {
		return;
	}

	const controller = new AbortController();
	const sections = {
		home: '/',
		about: '/about',
		projects: '/projects',
		blog: '/blog',
		api_docs: '/docs/api',
		llms: '/llms.txt'
	};

	function absolute(pathname) {
		return new URL(pathname, window.location.origin).toString();
	}

	function registerTool(definition) {
		modelContext.registerTool({
			...definition,
			signal: controller.signal
		});
	}

	registerTool({
		name: 'list_site_sections',
		description: 'List the main yaqeen.me sections and discovery resources.',
		inputSchema: {
			type: 'object',
			properties: {},
			additionalProperties: false
		},
		execute: async function () {
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(
							Object.entries(sections).map(function ([name, pathname]) {
								return { name: name, url: absolute(pathname) };
							}),
							null,
							2
						)
					}
				]
			};
		}
	});

	registerTool({
		name: 'search_blog_posts',
		description: 'Search yaqeen.me blog posts by title, slug, and description.',
		inputSchema: {
			type: 'object',
			properties: {
				query: { type: 'string', minLength: 1 },
				limit: { type: 'integer', minimum: 1, maximum: 10, default: 5 }
			},
			required: ['query'],
			additionalProperties: false
		},
		execute: async function (input) {
			const query = String(input.query || '')
				.trim()
				.toLowerCase();
			const limit = Math.min(Math.max(Number(input.limit) || 5, 1), 10);

			const response = await fetch('/blog/api/posts?limit=100');
			if (!response.ok) {
				throw new Error('Unable to load blog posts.');
			}

			const data = await response.json();
			const matches = (data.allPosts || [])
				.filter(function (post) {
					const haystack = [post.title, post.slug, post.description].join(' ').toLowerCase();
					return haystack.includes(query);
				})
				.slice(0, limit)
				.map(function (post) {
					return {
						title: post.title,
						description: post.description,
						url: post.canonicalUrl || absolute(post.href),
						isExternal: Boolean(post.isExternal)
					};
				});

			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(matches, null, 2)
					}
				]
			};
		}
	});

	registerTool({
		name: 'get_current_page_context',
		description: 'Return the current yaqeen.me page title, URL, and description.',
		inputSchema: {
			type: 'object',
			properties: {},
			additionalProperties: false
		},
		execute: async function () {
			const descriptionNode = document.querySelector('meta[name="description"]');

			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(
							{
								title: document.title,
								url: window.location.href,
								description: descriptionNode ? descriptionNode.getAttribute('content') : ''
							},
							null,
							2
						)
					}
				]
			};
		}
	});

	window.addEventListener(
		'pagehide',
		function () {
			controller.abort();
		},
		{ once: true }
	);
})();
