import exifr from 'exifr';
import { dev } from '$app/environment';
import { fallbackPhotoKeys, photoUrl } from '$lib/data/photos.js';

const imageExtensions = /\.(avif|gif|jpe?g|png|webp)$/i;
const metadataExtensions = /\.json$/i;

export async function load({ fetch, platform, setHeaders }) {
	setHeaders({
		'cache-control': 'public, max-age=300'
	});

	const bucket = platform?.env?.PHOTOS_BUCKET;
	let photos = bucket
		? await loadPhotosFromBucket(bucket)
		: await loadPhotosFromPublicKeys(fetch, fallbackPhotoKeys);

	// In dev the bucket is a local, empty stand-in for R2, so nothing comes back.
	// Fill the grid with placeholders so the page can still be worked on.
	if (dev && !photos.length) {
		photos = placeholderPhotos();
	}

	return {
		photos
	};
}

/* Placeholders, for dev only. A spread of shapes (landscape, portrait, square,
   wide, tall) and of captions (a place, coordinates only, nothing at all), so
   the grid and its captions can be tried against each. */
const placeholderShapes = [
	{ width: 1600, height: 1067, place: 'Danmagaji', year: '2026' },
	{ width: 1200, height: 1800, place: 'Osapa, Lagos', year: '2026' },
	{ width: 1600, height: 1600, place: 'Kano', year: '2025' },
	{ width: 1920, height: 1080, latitude: 9.0765, longitude: 7.3986, year: '2025' },
	{ width: 1280, height: 1600, place: 'Abuja', year: '2025' },
	{ width: 1600, height: 1200, place: 'Zaria', year: '2024' },
	{ width: 1080, height: 1920, place: 'Jos Plateau', year: '2024' },
	{ width: 1600, height: 1067 },
	{ width: 1200, height: 1500, place: 'Ilorin', year: '2023' },
	{ width: 2000, height: 857, place: 'Lekki, Lagos', year: '2023' }
];

const placeholderTones = [
	['#d9b38c', '#8a5a3c'],
	['#a9b8a0', '#4f5e48'],
	['#e3c7a6', '#b06a45'],
	['#9fb3c8', '#4a5d73'],
	['#cdb6a0', '#6e5646'],
	['#e8d3b0', '#a4824f'],
	['#b8a6c4', '#5c4b6b'],
	['#c9c2b4', '#6b655b'],
	['#d8a88f', '#7d4632'],
	['#a6c1bd', '#3f625e']
];

function placeholderPhotos() {
	return placeholderShapes.map((shape, index) => {
		const { width, height, place, year, latitude, longitude } = shape;
		const [light, dark] = placeholderTones[index % placeholderTones.length];
		const number = String(index + 1).padStart(2, '0');
		const label = `${number} · ${width}×${height}`;
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" fill="rgba(255,255,255,0.75)" font-family="ui-monospace, Menlo, monospace" font-size="${Math.round(Math.min(width, height) / 18)}" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;

		return {
			key: `placeholder-${number}`,
			src: `data:image/svg+xml,${encodeURIComponent(svg)}`,
			width,
			height,
			alt: `Placeholder photo ${number}`,
			place,
			year,
			camera: undefined,
			// One day apart, newest first, so they keep this order.
			date: new Date(Date.UTC(2026, 4, 30 - index)).toISOString(),
			latitude,
			longitude
		};
	});
}

async function loadPhotosFromBucket(bucket) {
	const keys = [];
	const metadataKeys = new Set();
	let cursor;

	do {
		const page = await bucket.list({ cursor });
		keys.push(...page.objects.map((object) => object.key).filter(isImageKey));
		page.objects
			.map((object) => object.key)
			.filter((key) => metadataExtensions.test(key))
			.forEach((key) => metadataKeys.add(key));
		cursor = page.truncated ? page.cursor : undefined;
	} while (cursor);

	if (!keys.length) {
		keys.push(...fallbackPhotoKeys);
	}

	const manifest = await readJsonObject(bucket, 'photos.json');

	const photos = await Promise.all(
		keys.map(async (key) => {
			const object = await bucket.get(key);
			if (!object) return null;

			const sidecar = await readPhotoSidecar(bucket, key, metadataKeys);
			const arrayBuffer = await object.arrayBuffer();
			const metadata = await readPhotoMetadata(arrayBuffer, {
				...metadataForKey(manifest, key),
				...sidecarMetadata(sidecar),
				...object.customMetadata
			});

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

	return {
		width: numberFrom(firstValue(customMetadata.width, exif?.ImageWidth, exif?.ExifImageWidth)),
		height: numberFrom(firstValue(customMetadata.height, exif?.ImageHeight, exif?.ExifImageHeight)),
		alt: pick(customMetadata.alt, customMetadata.description, exif?.ImageDescription),
		place: placeFrom(customMetadata, exif),
		camera: pick(customMetadata.camera),
		date: dateFrom(
			firstValue(customMetadata.date, exif?.DateTimeOriginal, exif?.CreateDate, exif?.DateCreated)
		),
		latitude: numberFrom(
			firstValue(
				customMetadata.latitude,
				customMetadata.lat,
				customMetadata.gpsLatitude,
				exif?.latitude
			)
		),
		longitude: numberFrom(
			firstValue(
				customMetadata.longitude,
				customMetadata.lon,
				customMetadata.lng,
				customMetadata.gpsLongitude,
				exif?.longitude
			)
		)
	};
}

function toPhoto(key, metadata, uploaded) {
	const year =
		metadata.date?.getUTCFullYear()?.toString() ?? uploaded?.getUTCFullYear()?.toString();
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

async function readPhotoSidecar(bucket, key, metadataKeys) {
	const sidecarKeys = [`${key}.json`, `${key.replace(/\.[^.]+$/, '')}.json`];
	const sidecarKey = sidecarKeys.find((candidate) => metadataKeys.has(candidate));
	return sidecarKey ? await readJsonObject(bucket, sidecarKey) : undefined;
}

async function readJsonObject(bucket, key) {
	const object = await bucket.get(key);
	if (!object) return undefined;

	return await object.json().catch(() => undefined);
}

function metadataForKey(manifest, key) {
	if (Array.isArray(manifest)) {
		return (
			manifest.find(
				(entry) => entry?.key === key || entry?.src === photoUrl(key) || entry?.filename === key
			) ?? {}
		);
	}

	return manifest?.[key] ?? {};
}

function sidecarMetadata(sidecar) {
	if (!sidecar) return {};

	const geo = sidecar.geoDataExif ?? sidecar.geoData ?? sidecar.location ?? {};
	const timestamp = sidecar.photoTakenTime?.timestamp;

	return {
		alt: sidecar.description ?? sidecar.title,
		date: timestamp ? Number(timestamp) * 1000 : sidecar.creationTime?.timestamp,
		latitude: geo.latitude,
		longitude: geo.longitude,
		place:
			sidecar.place ??
			sidecar.locationName ??
			sidecar.googlePhotosOrigin?.mobileUpload?.deviceFolder?.localFolderName
	};
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
