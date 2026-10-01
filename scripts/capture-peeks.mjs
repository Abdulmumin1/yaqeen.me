// Re-shoots the little screenshots that pop up when you hover a project on the
// home page (static/peeks/*.webp).
//
//   node scripts/capture-peeks.mjs            # everything
//   node scripts/capture-peeks.mjs owostack   # just one
//
// Drives a headless copy of the locally installed Chrome over the DevTools
// protocol (no dependencies; Node 22+). Each page is shot at 1440x900 @2x and
// resampled inside Chrome to an 800x500 WebP. Set CHROME_PATH if Chrome lives
// somewhere unusual.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function findChrome() {
	const candidates = [
		process.env.CHROME_PATH,
		'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
		'/Applications/Chromium.app/Contents/MacOS/Chromium',
		'/usr/bin/google-chrome',
		'/usr/bin/chromium'
	].filter(Boolean);
	const found = candidates.find((path) => existsSync(path));
	if (!found) throw new Error('Chrome not found. Set CHROME_PATH to a Chrome/Chromium binary.');
	return found;
}

async function launchChrome(port = 9333) {
	const profile = mkdtempSync(join(tmpdir(), 'peeks-chrome-'));
	const child = spawn(
		findChrome(),
		[
			'--headless=new',
			`--remote-debugging-port=${port}`,
			`--user-data-dir=${profile}`,
			'--hide-scrollbars',
			'--no-first-run',
			'--no-default-browser-check',
			'--disable-extensions',
			'--mute-audio',
			`--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
			'about:blank'
		],
		{ stdio: 'ignore' }
	);
	const base = `http://127.0.0.1:${port}`;
	const close = async () => {
		const exited = new Promise((resolve) => child.once('exit', resolve));
		child.kill('SIGTERM');
		await exited;
		try {
			rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
		} catch {
			// A leftover temp profile is harmless.
		}
	};

	for (let attempt = 0; attempt < 80; attempt += 1) {
		try {
			if ((await fetch(`${base}/json/version`)).ok) return { base, close };
		} catch {
			// Chrome is still starting.
		}
		await sleep(250);
	}
	await close();
	throw new Error('Chrome did not open its debugging port.');
}

async function openTab(base) {
	const target = await (await fetch(`${base}/json/new?about:blank`, { method: 'PUT' })).json();
	const socket = new WebSocket(target.webSocketDebuggerUrl);
	await new Promise((resolve, reject) => {
		socket.addEventListener('open', resolve, { once: true });
		socket.addEventListener('error', reject, { once: true });
	});

	let nextId = 1;
	const pending = new Map();
	const waiters = new Map();
	socket.addEventListener('message', ({ data }) => {
		const message = JSON.parse(data);
		if (message.id && pending.has(message.id)) {
			const { resolve, reject } = pending.get(message.id);
			pending.delete(message.id);
			if (message.error) reject(new Error(message.error.message));
			else resolve(message.result);
		} else if (waiters.has(message.method)) {
			waiters.get(message.method)();
			waiters.delete(message.method);
		}
	});

	const send = (method, params = {}) =>
		new Promise((resolve, reject) => {
			const id = nextId++;
			pending.set(id, { resolve, reject });
			socket.send(JSON.stringify({ id, method, params }));
		});
	const waitFor = (method, timeout) =>
		new Promise((resolve) => {
			const timer = setTimeout(resolve, timeout);
			waiters.set(method, () => {
				clearTimeout(timer);
				resolve();
			});
		});
	const evaluate = async (expression) => {
		const { result, exceptionDetails } = await send('Runtime.evaluate', {
			expression,
			awaitPromise: true,
			returnByValue: true
		});
		if (exceptionDetails) {
			throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
		}
		return result.value;
	};

	await send('Page.enable');
	return { send, waitFor, evaluate };
}

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

const chrome = await launchChrome();
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
