export const photoBucket = {
	name: 'yaqeen-me-photos',
	baseUrl: 'https://photos-cloud.yaqeen.me'
};

export function photoUrl(key) {
	return `${photoBucket.baseUrl}/${key}`;
}

export const fallbackPhotoKeys = [
	'20260522_150202~2.jpg',
	'20260522_150338~2.jpg',
	'danmagaji-mountain-eid-adha-2026.jpg',
	'osapa-cloudplexo-house-window-view.jpg'
];

export const photoNotes = {
	title: 'Photos',
	intro: 'A small set of photos I like.',
	storageHint:
		'Upload photo selects to the yaqeen-me-photos R2 bucket. The page reads the bucket dynamically in production.'
};
