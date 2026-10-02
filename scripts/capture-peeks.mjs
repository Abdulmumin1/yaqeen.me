// Re-shoots the little screenshots that pop up when you hover a project on the
// home page (static/peeks/*.webp).
//
//   node scripts/capture-peeks.mjs            # everything
//   node scripts/capture-peeks.mjs owostack   # just one
//
// Drives a headless copy of the locally installed Chrome (see
// lib/headless-chrome.mjs; no dependencies, Node 22+). Each page is shot at
// 1440x900 @2x and resampled inside Chrome to an 800x500 WebP.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome, openTab, sleep } from './lib/headless-chrome.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'static', 'peeks');
const VIEWPORT = { width: 1440, height: 900, dpr: 2 };
const PRINT = { width: 800, height: 500, quality: 0.82 };

/**
 * `wait` is how long the page gets to finish its entrance animations before
 * the shutter; `hide` lists selectors to display:none (cookie banners).
 */
const SITES = [
	{ id: 'owostack', url: 'https://owostack.com', wait: 3500 },
	{ id: 'thirdpen', url: 'https://thirdpen.app', wait: 2500, hide: ['aside.fixed'] },
	{ id: 'littlestats', url: 'https://littlestats.click', wait: 3000 },
	{
		id: 'devcanvas',
		url: 'https://devcanvas.dev',
		wait: 8000,
		hide: ['.fixed.bottom-0.left-0.z-50']
	},
	{ id: 'chump', url: 'https://chmp.dev', wait: 2500 },
	{ id: 'ai-query', url: 'https://ai-query.dev', wait: 2500 },
	{ id: 'onlocal', url: 'https://onlocal.dev', wait: 2000 },
	{ id: 'dearfutureself', url: 'https://dearfutureself.me', wait: 2000 }
];

async function shoot(tab, site) {
	// A background tab gets no animation frames, so heroes would freeze half-drawn.
	await tab.send('Page.bringToFront');
	const loaded = tab.waitFor('Page.loadEventFired', 45_000);
	await tab.send('Page.navigate', { url: site.url });
	await loaded;
	await tab.evaluate('document.fonts.ready.then(() => true)');

	if (site.hide?.length) {
		const css = `${site.hide.join(',')} { display: none !important; }`;
		await tab.evaluate(
			`document.head.appendChild(Object.assign(document.createElement('style'), { textContent: ${JSON.stringify(css)} })); true`
		);
	}

	await sleep(site.wait);
	const { data } = await tab.send('Page.captureScreenshot', { format: 'png' });
	return data;
}

/** Resample the 2x PNG with Chrome's own high-quality scaler and encode it as WebP. */
async function develop(darkroom, png) {
	return darkroom.evaluate(`(async () => {
		const source = await (await fetch('data:image/png;base64,${png}')).blob();
		const bitmap = await createImageBitmap(source, {
			resizeWidth: ${PRINT.width},
			resizeHeight: ${PRINT.height},
			resizeQuality: 'high'
		});
		const canvas = new OffscreenCanvas(${PRINT.width}, ${PRINT.height});
		canvas.getContext('2d').drawImage(bitmap, 0, 0);
		const blob = await canvas.convertToBlob({ type: 'image/webp', quality: ${PRINT.quality} });
		const bytes = new Uint8Array(await blob.arrayBuffer());
		let binary = '';
		for (let i = 0; i < bytes.length; i += 0x8000) {
			binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
		}
		return btoa(binary);
	})()`);
}

const only = process.argv.slice(2);
const sites = only.length ? SITES.filter((site) => only.includes(site.id)) : SITES;
if (!sites.length) {
	console.error(`Nothing to shoot. Known ids: ${SITES.map((site) => site.id).join(', ')}`);
	process.exit(1);
}

const chrome = await launchChrome(VIEWPORT);
try {
	const darkroom = await openTab(chrome.base);
	const tab = await openTab(chrome.base);
	await tab.send('Emulation.setDeviceMetricsOverride', {
		width: VIEWPORT.width,
		height: VIEWPORT.height,
		deviceScaleFactor: VIEWPORT.dpr,
		mobile: false
	});
	await tab.send('Emulation.setEmulatedMedia', {
		features: [
			{ name: 'prefers-color-scheme', value: 'light' },
			{ name: 'prefers-reduced-motion', value: 'no-preference' }
		]
	});
	mkdirSync(OUT, { recursive: true });

	for (const site of sites) {
		try {
			const file = Buffer.from(await develop(darkroom, await shoot(tab, site)), 'base64');
			writeFileSync(join(OUT, `${site.id}.webp`), file);
			console.log(`${site.id}.webp  ${Math.round(file.length / 1024)}kB`);
		} catch (error) {
			console.error(`${site.id} (${site.url}) failed: ${error.message}`);
			process.exitCode = 1;
		}
	}
} finally {
	await chrome.close();
}
