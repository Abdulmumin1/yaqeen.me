import { appendFile } from 'node:fs/promises';

// adapter-cloudflare owns the Worker entrypoint. Appending the export after it
// has generated that file keeps the Durable Object in the same deployed Worker.
await appendFile(
	'.svelte-kit/cloudflare/_worker.js',
	"\nexport { Guestbook } from '../../src/lib/server/guestbook.js';\n"
);
