---
title: 'Migrating your Sveltekit app from Nodejs to Bunjs'

description: 'To migrate your SvelteKit project from using Node.js to Bun, you can follow these steps, which align with the best practices and examples provided in the Bun and SvelteKit documentation.'

date: '2024-05-12'

lastmod: '2024-05-18'

categories:
  - snippets

  - bunjs

label: 'notes'

published: true
---

> Snippets

To migrate your SvelteKit project from using Node.js to Bun, you can follow these steps, which align with the best practices and examples provided in the Bun and SvelteKit documentation.

Here's a general guide:

### Install Bun

If you haven't already, ensure you have Bun installed on your system. You can install it by following the instructions on the Bun website or:

On linux/macos:

```bash
curl -fsSL https://bun.sh/install | bash
```

Windows :

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

## Update Your Project to use bun

Start by updating your project's dependencies to be compatible with Bun. This includes ensuring any SvelteKit adapters or plugins you use are compatible with Bun. You’re recommended to use the `svelte-adapter-bun` as it is specifically designed for Bun.

```bash
bun add -D svelte-adapter-bun
```

Update your `svelte.config.js` to use the Bun adapter. Replace your existing adapter with svelte-adapter-bun.

```javascript
// - import adapter from "@sveltejs/adapter-auto";
import adapter from 'svelte-adapter-bun';
// other imports and configuration
const config = { kit: { adapter: adapter(), // other kit options }, };

export default config;
```

### Migrate Node Scripts:

If your `package.json` contains Nodejs-specific scripts, you may need to adjust them for compatibility with Bun. For running your development server or building your project, replace node commands with bun commands.

Something like this for example for your node scripts:

```json
"scripts": {
    - "treat": "node treat-api.js"
    + "treat": "bun treat-api.js"
}
```

### Testing and Development:

Run your development server using Bun to test if the migration was successful. You use `bun` Instead of `npm` to run the scripts in your `package.json`

```bash
bun --bun run dev
```

For building the project:

```bash
bun run build
```

### Deployment

If you're deploying your SvelteKit project, ensure your deployment environment supports Bun. You might need to adjust your deployment scripts or configuration to use Bun instead of Node.js.

Remember, while Bun aims to be a drop-in replacement for Node.js with significant performance improvements, there may be specific cases where compatibility issues arise due to the differences between the environments. It's always a good idea to thoroughly test your application after migrating to ensure everything works as expected.

Keep in mind that Bun is rapidly evolving, and features or compatibility improvements are regularly added. Always refer to the latest Bun documentation for up-to-date guidance and support.
