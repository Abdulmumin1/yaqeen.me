---
title: 'How to use Sass or Scss in Svelte/Sveltekit'

description: "SASS has a pretty strong fan base, It was something beautiful that Introduced a feature that was never needed but definitely desired and cool to have. This is why sass is not widely adopted and frameworks only do a little to make sure it works out of the box or seamlessly.
"

date: '2024-01-13'

categories:
  - svelte
  - sass
  - css
  
thumbnail: 'https://cdn.hashnode.com/res/hashnode/image/upload/v1705166371720/9944b8fe-5a7f-4920-b6c1-bca9d499b52b.png'

published: true
---

SASS has a pretty strong fan base, It was something beautiful that Introduced a feature that was never needed but definitely desired and cool to have. This is why sass is not widely adopted and frameworks only do a little to make sure it works out of the box or seamlessly.

Nevertheless, Svelte, a framework that supercharges developers with superpowers and massively increases productivity in the building of the web, making it a more enjoyable process for developers, did not forget about the sass enthusiast.

It does not require much effort to get it working in your svelte project, and not just the global CSS, but also the scoped styles. How beautiful.

## 1. Install Sass and Svelte Preprocess

In order to of course compile your scss, you need to install it preprocessor, there are multiple options for this, stated as follows:

- node-sass, this is deprecated and I strongly recommend not using it.
- dart-sass, this is currently maintained, and better implementation of `node-sass`, also have been transformed into `sass`.
- `sass` this is perfect!

> If you’re using sveltekit, you can skip installing svelte-preprocess and also step 2 below.

Install as a dev-dependency using:

```bash
    // npm
    npm i -D sass svelte-preprocess

    // pnpm
    pnpm add -D sass svelte-preprocess

    // yarn
    yarn add -D sass svelte-preprocess
```

## 2. Svelte Preprocess Config

This step is only required for Svelte and not Sveltekit. Sveltekit by default has the necessary, to handle Sass/Scss preprocessor.

In your `rolloup.config.js`

```svelte {8}
    import svelte from 'rollup-plugin-svelte'
    import sveltePreprocess from 'svelte-preprocess';

    export default {
      // other configs
      plugins: [
        svelte({
          preprocess: sveltePreprocess(),
        }),
      ],
    };
```

If you have global CSS written in scss, you can modify the config to include the path:

> These additional config can also be done in sveltekit in your `svelte.config.js`

```svelte {3-6}
    // ...
      preprocess: sveltePreprocess(
        // Not recommended though
        scss: {
          includePaths: ['src/styles'], // Optional, specify additional include paths
        }
      ),
    // ...
```

> You can learn more about the official svelte-preprocess and other available config [here](https://github.com/sveltejs/svelte-preprocess/blob/main/docs/getting-started.md)

## 3. Create a Svelte component with Sass enabled

To enable Sass/Scss in scoped styles, all you have to do is add `lang="scss"` in the `<style>` tag.

**Example**

```html
<style lang="scss">
	$primary-color: #3498db;
	$secondary-color: #2ecc71;

	.button {
	  background-color: $primary-color;
	  color: white;
	  padding: 10px 20px;
	  border-radius: 5px;
	  transition: background-color 0.3s ease;

	  &:hover {
	    background-color: darken($primary-color, 10%);
	  }
</style>
```

Following these steps, you can now harness the power of Scss and Svelte altogether.

**Peace ✌**
