import { externalPosts } from '$lib/data/externalPosts.js';
import { siteOrigin } from '$lib/js/config.js';

function slugify(value) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function normalizeExternalPost(post, index) {
	const slug = post.slug || slugify(post.title || post.url || `external-post-${index + 1}`);

	return {
		...post,
		slug,
		href: post.url,
		canonicalUrl: post.url,
		externalUrl: post.url,
		isExternal: true
	};
}

function normalizeInternalPost(post) {
	return {
		...post,
		href: `/blog/${post.slug}`,
		canonicalUrl: post.canonical || `${siteOrigin}/blog/${post.slug}`,
		isExternal: false
	};
}

export function getAllPosts() {
	const paths = import.meta.glob('../../routes/blog/posts/*.md', { eager: true });

	const internalPosts = Object.entries(paths).flatMap(([path, file]) => {
		const slug = path.split('/').at(-1)?.replace('.md', '');
		const metadata = file.metadata;
		const post = normalizeInternalPost({ ...metadata, slug });
		return post.published ? [post] : [];
	});

	const normalizedExternalPosts = externalPosts
		.filter((post) => post?.title && post?.url && post?.date)
		.map(normalizeExternalPost);

	return [...internalPosts, ...normalizedExternalPosts].sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);
}

export function getInternalPosts(posts = getAllPosts()) {
	return posts.filter((post) => !post.isExternal);
}
