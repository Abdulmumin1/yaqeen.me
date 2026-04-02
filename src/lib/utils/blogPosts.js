import { externalPosts } from '$lib/data/externalPosts.js';
import { siteOrigin } from '$lib/js/config.js';

function slugify(value) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function getTimestamp(value) {
	const timestamp = new Date(value).getTime();
	return Number.isNaN(timestamp) ? 0 : timestamp;
}

function comparePosts(first, second) {
	if (Boolean(first.pinned) !== Boolean(second.pinned)) {
		return Boolean(first.pinned) ? -1 : 1;
	}

	return getTimestamp(second.date) - getTimestamp(first.date);
}

function normalizePost(post) {
	return {
		...post,
		pinned: Boolean(post.pinned)
	};
}

function normalizeExternalPost(post, index) {
	const slug = post.slug || slugify(post.title || post.url || `external-post-${index + 1}`);

	return normalizePost({
		...post,
		slug,
		href: post.url,
		canonicalUrl: post.url,
		externalUrl: post.url,
		isExternal: true
	});
}

function normalizeInternalPost(post) {
	return normalizePost({
		...post,
		href: `/blog/${post.slug}`,
		canonicalUrl: post.canonical || `${siteOrigin}/blog/${post.slug}`,
		isExternal: false
	});
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

	return [...internalPosts, ...normalizedExternalPosts].sort(comparePosts);
}

export function getInternalPosts(posts = getAllPosts()) {
	return posts.filter((post) => !post.isExternal);
}

export function getPinnedPosts(posts = getAllPosts()) {
	return posts.filter((post) => post.pinned);
}

export function getRegularPosts(posts = getAllPosts()) {
	return posts.filter((post) => !post.pinned);
}
