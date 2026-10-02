// Cuts the photo of the monarch into the pieces the butterfly on the home page
// is built from, and packs them into one texture:
//
//   static/butterfly/monarch.png  →  static/butterfly/monarch-atlas.webp
//
//   node scripts/cut-butterfly.mjs
//
// The atlas holds two layers (their places are in src/lib/butterfly/atlas.js):
//  - the wings: the whole photo with the head and antennae rubbed out, so that
//    when a wing swings up over the back it does not take an antenna with it;
//  - the body: head, thorax, abdomen and antennae on their own, feathered at the
//    sides where the wings grow out of it.
//
// The masks below are measured off this particular photo. A different butterfly
// needs its own (and its own numbers at the top of src/lib/butterfly/monarch.js).
//
// The pixel work happens in a headless copy of the locally installed Chrome
// (see lib/headless-chrome.mjs; no dependencies, Node 22+).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ATLAS, AXIS, SOURCE } from '../src/lib/butterfly/atlas.js';
import { launchChrome, openTab } from './lib/headless-chrome.mjs';

const FOLDER = join(dirname(fileURLToPath(import.meta.url)), '..', 'static', 'butterfly');
const QUALITY = 0.9;

const MASK = {
	// Above this row the head and antennae are islands, clear of the wings.
	islandsAbove: 379,
	// ...and down to this one the head still is, so it can be lifted off the wings layer.
	headAbove: 428,
	// Nothing further than this from the centre line counts as an island.
	islandReach: 200,
	// Below `islandsAbove` the body runs into the wings, so it is cut out by
	// shape instead: [row, half-width] down the photo.
	silhouette: [
		[380, 34],
		[428, 36],
		[520, 37],
		[560, 33],
		[600, 28],
		[640, 26],
		[760, 25],
		[785, 19],
		[800, 8],
		[806, 0]
	],
	feather: 10
};

/** Runs in the page. Returns the atlas as base64 WebP. */
async function cut({ photo, source, axis, atlas, mask, quality }) {
	const bitmap = await createImageBitmap(await (await fetch(photo)).blob());
	if (bitmap.width !== source.width || bitmap.height !== source.height) {
		throw new Error(`Expected a ${source.width}x${source.height} photo.`);
	}
	const { width, height } = source;
	const scratch = new OffscreenCanvas(width, height).getContext('2d');
	scratch.drawImage(bitmap, 0, 0);
	const original = scratch.getImageData(0, 0, width, height);
	const wings = new ImageData(new Uint8ClampedArray(original.data), width, height);
	const body = new ImageData(width, height);
	const alpha = (x, y) => original.data[(y * width + x) * 4 + 3];

	/** Runs of solid pixels in a row that stay near the centre line: head and antennae. */
	function islands(y, each) {
		let start = -1;
		for (let x = 0; x <= width; x += 1) {
			const solid = x < width && alpha(x, y) > 0;
			if (solid && start < 0) start = x;
			if (!solid && start >= 0) {
				if (start > axis - mask.islandReach && x - 1 < axis + mask.islandReach) {
					for (let k = start; k < x; k += 1) each((y * width + k) * 4);
				}
				start = -1;
			}
		}
	}

	function halfWidth(y) {
		const stops = mask.silhouette;
		for (let i = 1; i < stops.length; i += 1) {
			if (y <= stops[i][0]) {
				const [y0, w0] = stops[i - 1];
				const [y1, w1] = stops[i];
				return w0 + ((w1 - w0) * (y - y0)) / (y1 - y0);
			}
		}
		return 0;
	}

	for (let y = 0; y < height; y += 1) {
		if (y <= mask.islandsAbove) {
			islands(y, (i) => {
				body.data.set(original.data.subarray(i, i + 4), i);
				wings.data[i + 3] = 0;
			});
			continue;
		}
		if (y <= mask.headAbove) islands(y, (i) => (wings.data[i + 3] = 0));

		const half = halfWidth(y);
		if (half <= 0) continue;
		const reach = Math.ceil(half + mask.feather);
		for (let x = axis - reach; x <= axis + reach; x += 1) {
			const out = Math.abs(x - axis);
			let cover = out <= half ? 1 : Math.max(0, 1 - (out - half) / mask.feather);
			cover = cover * cover * (3 - 2 * cover);
			const i = (y * width + x) * 4;
			body.data.set(original.data.subarray(i, i + 3), i);
			body.data[i + 3] = Math.round(original.data[i + 3] * cover);
		}
	}

	const sheet = new OffscreenCanvas(atlas.size, atlas.size);
	const pen = sheet.getContext('2d');
	const shrink = (pixels, to) =>
		createImageBitmap(pixels, {
			resizeWidth: to.width,
			resizeHeight: to.height,
			resizeQuality: 'high'
		});

	pen.drawImage(await shrink(wings, atlas.wings), atlas.wings.x, atlas.wings.y);

	const { from } = atlas.body;
	const crop = new OffscreenCanvas(width, height).getContext('2d');
	crop.putImageData(body, 0, 0);
	const cropped = crop.getImageData(from.left, from.top, from.width, from.height);
	pen.drawImage(await shrink(cropped, atlas.body), atlas.body.x, atlas.body.y);

	const blob = await sheet.convertToBlob({ type: 'image/webp', quality });
	const bytes = new Uint8Array(await blob.arrayBuffer());
	let binary = '';
	for (let i = 0; i < bytes.length; i += 0x8000) {
		binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
	}
	return btoa(binary);
}

const photo = `data:image/png;base64,${readFileSync(join(FOLDER, 'monarch.png')).toString('base64')}`;
const chrome = await launchChrome();
try {
	const tab = await openTab(chrome.base);
	// The photo is too big to send as one protocol message, so it goes over in pieces.
	await tab.evaluate('window.photo = ""; true');
	for (let i = 0; i < photo.length; i += 500_000) {
		await tab.evaluate(`window.photo += ${JSON.stringify(photo.slice(i, i + 500_000))}; true`);
	}
	const settings = { source: SOURCE, axis: AXIS, atlas: ATLAS, mask: MASK, quality: QUALITY };
	const webp = await tab.evaluate(
		`(${cut.toString()})({ photo: window.photo, ...${JSON.stringify(settings)} })`
	);
	const file = Buffer.from(webp, 'base64');
	writeFileSync(join(FOLDER, 'monarch-atlas.webp'), file);
	console.log(`monarch-atlas.webp  ${Math.round(file.length / 1024)}kB`);
} finally {
	await chrome.close();
}
