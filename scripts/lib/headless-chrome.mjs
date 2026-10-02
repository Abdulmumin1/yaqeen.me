// A tiny client for a headless copy of the locally installed Chrome, driven
// over the DevTools protocol. No dependencies (Node 22+ for the global
// WebSocket and fetch). Set CHROME_PATH if Chrome lives somewhere unusual.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

/** @param {{ port?: number, width?: number, height?: number }} [options] */
export async function launchChrome({ port = 9333, width = 1440, height = 900 } = {}) {
	const profile = mkdtempSync(join(tmpdir(), 'headless-chrome-'));
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
			`--window-size=${width},${height}`,
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

/** Open a tab and return `send` (a protocol command), `waitFor` (an event) and `evaluate` (run JS in the page). */
export async function openTab(base) {
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
