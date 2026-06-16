import exifr from 'exifr';
import { fallbackPhotoKeys, photoUrl } from '$lib/data/photos.js';

const imageExtensions = /\.(avif|gif|jpe?g|png|webp)$/i;

export async function load({ fetch, platform, setHeaders }) {
	setHeaders({
		'cache-control': 'public, max-age=300'
	});

	const bucket = platform?.env?.PHOTOS_BUCKET;
	const photos = bucket
		? await loadPhotosFromBucket(bucket)
		: await loadPhotosFromPublicKeys(fetch, fallbackPhotoKeys);

	return {
		photos
	};
}

async function loadPhotosFromBucket(bucket) {
	const keys = [];
	let cursor;

	do {
		const page = await bucket.list({ cursor });
		keys.push(...page.objects.map((object) => object.key).filter(isImageKey));
		cursor = page.truncated ? page.cursor : undefined;
	} while (cursor);

	if (!keys.length) {
		keys.push(...fallbackPhotoKeys);
	}

	const photos = await Promise.all(
		keys.map(async (key) => {
			const object = await bucket.get(key);
			if (!object) return null;

			const arrayBuffer = await object.arrayBuffer();
			const metadata = await readPhotoMetadata(arrayBuffer, object.customMetadata);

			return toPhoto(key, metadata, object.uploaded);
		})
	);

	return photos.filter(Boolean).sort(sortPhotos);
}

async function loadPhotosFromPublicKeys(fetch, keys) {
	const photos = await Promise.all(
		keys.filter(isImageKey).map(async (key) => {
			const response = await fetch(photoUrl(key));
			if (!response.ok) return null;

			const arrayBuffer = await response.arrayBuffer();
			const metadata = await readPhotoMetadata(arrayBuffer);

			return toPhoto(key, metadata);
		})
	);

	return photos.filter(Boolean).sort(sortPhotos);
}

async function readPhotoMetadata(arrayBuffer, customMetadata = {}) {
	const exif = await exifr
		.parse(arrayBuffer, {
			tiff: true,
			ifd0: true,
			exif: true,
			gps: true,
			xmp: true,
			iptc: true,
			mergeOutput: true
		})
		.catch(() => ({}));

	const make = pick(customMetadata.make, exif?.Make);
	const model = pick(customMetadata.model, exif?.Model);

	return {
		width: numberFrom(firstValue(customMetadata.width, exif?.ImageWidth, exif?.ExifImageWidth)),
		height: numberFrom(firstValue(customMetadata.height, exif?.ImageHeight, exif?.ExifImageHeight)),
		alt: pick(customMetadata.alt, customMetadata.description, exif?.ImageDescription),
		place: placeFrom(customMetadata, exif),
		camera: pick(customMetadata.camera, [make, model].filter(Boolean).join(' ')),
		date: dateFrom(firstValue(customMetadata.date, exif?.DateTimeOriginal, exif?.CreateDate, exif?.DateCreated)),
		latitude: numberFrom(firstValue(customMetadata.latitude, customMetadata.lat, exif?.latitude)),
		longitude: numberFrom(firstValue(customMetadata.longitude, customMetadata.lon, exif?.longitude))
	};
}

function toPhoto(key, metadata, uploaded) {
	const year = metadata.date?.getUTCFullYear()?.toString() ?? uploaded?.getUTCFullYear()?.toString();
	const alt = metadata.alt || [metadata.place, year, 'photo'].filter(Boolean).join(' ') || key;

	return {
		key,
		src: photoUrl(key),
		width: metadata.width ?? 1600,
		height: metadata.height ?? 1200,
		alt,
		place: metadata.place,
		year,
		camera: metadata.camera,
		date: metadata.date?.toISOString() ?? uploaded?.toISOString(),
		latitude: metadata.latitude,
		longitude: metadata.longitude
	};
}

function placeFrom(customMetadata, exif) {
	return pick(
		customMetadata.place,
		customMetadata.location,
		customMetadata.city,
		customMetadata.sublocation,
		customMetadata.country,
		exif?.Location,
		exif?.City,
		exif?.SubLocation,
		exif?.Country,
		exif?.CountryCode
	);
}

function sortPhotos(a, b) {
	return (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0) || a.key.localeCompare(b.key);
}

function isImageKey(key) {
	return imageExtensions.test(key);
}

function pick(...values) {
	return values.find((value) => typeof value === 'string' && value.trim())?.trim();
}

function firstValue(...values) {
	return values.find((value) => value !== undefined && value !== null && value !== '');
}

function numberFrom(value) {
	const number = Number(value);
	return Number.isFinite(number) ? number : undefined;
}

function dateFrom(value) {
	if (!value) return undefined;
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date;
}
