---
title: 'Zero to One: Svelte essentials and tooling'

description: 'in this article, my idea is to share a handful of the Svelte tools that I have discovered and become dependent on for my work. Some of the tools you undoubtedly know.'

date: '2024-04-14'

lastmod: '2024-04-14'

categories:
  - svelte

  - tools

  - sveltekit

  - svelte plugins

visual: false

published: true
---

Many JavaScript frameworks are designed in such a way that a wrapper somehow has to read code in a specific syntax rather than writing vanilla JavaScript. In Svelte, however, JavaScript is a first-class citizen that _generally_ has no need for further abstraction.

Why is this an important distinction? It means that, unlike many other popular frameworks, Svelte is able to support and leverage npm packages rather than needing some Svelte-specific alternative. That opens up a world of possibilities given what’s available in npm!

And, yes, there are Svelte-specific extensions and tooling that only add to the possibilities.

I’ve been working with Svelte for quite some time and have tinkered with different workflows, deployments, and component libraries to the extent that I feel I have a good idea of what the Svelte ecosystem has to offer to developers like us.

So, in this article, my idea is to share a handful of the Svelte tools that I have discovered and become dependent on for my work. Some of the tools you undoubtedly know, but a few I’m hoping are new to you and give you something new to add to your Svelte toolbox.

# First Off, SvelteKit

![ALT: SvelteKit website header showing a mechanical S-shaped machine.](https://paper-attachments.dropboxusercontent.com/s_78099A5AAB7FAD543254C74F65D20334229CC80157C488F1A36A2F83E05B096F_1704992322333_sveltekit-header.png)

Just as Next.js extends React, [SvelteKit](https://kit.svelte.dev) extends Svelte by offering an innovative approach to building both single page applications (SPAs) and multi-page applications (MPAs).

SvelteKit’s _raison d'être_ is really that it provides the baseline architecture for SPAa and MPAs, including file-based routing system, page load functions, form actions, and server-side rendering (SSR),, among other features. These collectively enhance DX and enable developers to create more robust and efficient applications.

Although I am sure that many of you who use Svelte also use SvelteKit, I thought I would briefly discuss the key features and how they work. If this is your first go-around with Svelte or SvelteKit, then you’ll want to know how the two work together.

## Routing

SvelteKit includes a files-based routing system — like Next.js for React applications. It is based on the following conventions:

- The root route is defined by the `src/routes` directory.
- Sub-directories of the routes directory define child routes.
- Files in a route directory are components that are rendered when the user navigates to that route.
- A `+page.svelte` file in a route directory defines the default component or page for that route.

There are a few parameters for routes in SvelteKit that can be used to dynamically load data. For example, the following route defines a route with a slug parameter:

```bash

src/routes/blog/[slug]

```

This route will match any URL where ` [``slug``] ` can be any string. The actual path of files is on disk; there’s a `[slug].ts` file on disk inside of the ` /``blog ` folder, which itself is inside of the ` /``routes ` folder

SvelteKit routing also includes support for nested routes, prefetching and prerendering, and route transitions. Even though I am tempted to talk about each one of those, I’ll point you to the SvelteKit documentation where you can [dive into the specifics of routing](https://kit.svelte.dev/docs/routing).

## Page Load Functions

The `page.js` file that accompanies `+page.svelte` in the route directory [exports a](https://kit.svelte.dev/docs/load#page-data) `[load](https://kit.svelte.dev/docs/load#page-data)` [function](https://kit.svelte.dev/docs/load#page-data).
Load functions run when the page is navigated, used to fetch and supply data to the page component when it is ready. You can also export a promise which can significantly reduce page loading time.

```js
export function load() {
	// perfom data fetch
}
```

## Server Side Rendering (SSR)

SSR, in short, allows renders on the server _before_ being sent to the client's browser with the idea that it increases how fast a page loads. HTML is rendered first on the server as opposed to client-side rendering which renders HTML in the browser.

You should know that SvelteKit ports [SSR capabilities](https://kit.svelte.dev/docs/page-options#ssr) to Svelte [as an opt-out feature](https://kit.svelte.dev/docs/single-page-apps). Many other frameworks will not give you that option and force you into SSR, so it’s a nice affordance.

## Standalone API Endpoints

Standalone endpoints in SvelteKit are a way to create server-side APIs that you can consume in your project, or even another project. The latter is the “standalone” part or the equation. It can be consumed independent of the application. For example you might decide to build a REST API and use it to send data to other apps.

Standalone endpoints are a form of routing like we saw earlier. Instead of defining an endpoint in `+page.svelte` like we would for file-based routes, endpoints use a `+server.js` (or TypeScript) file where all HTTP methods (i.e., `GET`, `POST`, `PUT`, `DELETE`) are called whenever the corresponding request comes in.

```js
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const body = Object.fromEntries(await request.formData());
	console.log(body);
}
```

That is a quick and dirty look at SvelteKit’s core features for extending Svelte. This is only the tip of the iceberg, and I encourage you to follow [SvelteKit’s own tutorial](https://learn.svelte.dev/tutorial/introducing-sveltekit) for a full overview of its capabilities.

Now that we have taken a look at SvelteKit as one category of Svelte extensibility, let’s look at others you may be less familiar with.

# Svelte Component Libraries

It's no secret that many developers rely on component libraries, particularly in scenarios where speed is of the essence. Whether you're a seasoned, pro or a newcomer to the field, the need for rapid deployment often necessitates a toolbox of pre-built components. I think this is where the React ecosystem really shines, thanks to its diverse and extensive collection of components. However, Svelte is no slouch in that department either.

I’’m going to point out a few of my favorite component libraries supported by Svelte, some of which are niche packages.

## Melt UI

![ALT: Melt UI website header showing popsicle logo.](https://paper-attachments.dropboxusercontent.com/s_78099A5AAB7FAD543254C74F65D20334229CC80157C488F1A36A2F83E05B096F_1704992122681_meltui-site-header.png)

[Melt UI](https://melt-ui.com) is an open-source component library designed just for Svelte. More specifically, Melt UI is a set of [_headless_](https://melt-ui.com/docs/builders/accordion) [\*\*](https://melt-ui.com/docs/builders/accordion)[_component builders_](https://melt-ui.com/docs/builders/accordion) for Svelte. It provides all of the components you might expect from a library, from accordions to tooltips, and many in between.

Melt UI is undeniably intriguing and stands out from the majority of other UI libraries, not only for its design and aesthetics, but for the considerations that have gone into all aspects of each component, including customization, accessibility, and performance.

That said, it's important to note that Melt UI is still in its early days of development. The official docs even say as much right at the top:

> **In Construction:** Melt UI is in its early stages. Expect breaking changes in minor releases until 1.0 is ready! And lots of new stuff! 🚀

So, maybe keep Melt UI in your back pocket for later rather than dumping it straight into production.

Headless architectures are an approach for managing content in modern web apps that seems perpetually stuck as an emerging trend. But it is gaining steam ([Smashing has a wealth of material on the topic](https://www.smashingmagazine.com/category/headless)) and Melt UI takes the concept to the extreme.

Instead of importing pre-built components, we import _builders_ and _apply_ them to components. This allows us to work with completely un-styled builders that get plugged into styled components. You might want more styling structure, but you can also imagine the sort of flexibility you gain when it comes to styling!

What that also means is that Melt UI is astyle-gnostic, allowing seamless integration with Open Props, Tailwind, and any other styling framework.

## Svelte Material UI (SMUI)

![ALT: Svelte Material UI website header showing a large Svelte logo circle.](https://paper-attachments.dropboxusercontent.com/s_78099A5AAB7FAD543254C74F65D20334229CC80157C488F1A36A2F83E05B096F_1704991997774_svelte-mui.png)

If you’re a fan of Google’s [M](https://mui.com/material-ui/getting-started/)[aterial UI](https://mui.com/material-ui/getting-started/) but don’t want to buy into React, then the [Svelte-flavored alternative](https://sveltematerialui.com) might be for you. It provides the same components and styles you’d get in a React environment, but in the context of a Svelte app.

Unlike, Melt UI, SMUI is a fully styled pre-built component you figuratively drop into your application. There are plenty of [theming options](https://sveltematerialui.com/THEMING.md) and you have the option of writing styles in CSS or Sass, both with configurable variables.

## shadcn-svelte

![ALT: Showing a collection of orange-themed card components on the shadocn-svelte website.](https://paper-attachments.dropboxusercontent.com/s_78099A5AAB7FAD543254C74F65D20334229CC80157C488F1A36A2F83E05B096F_1704991925921_svelte-shadowcn-ui.png)

[shadcn-svelte](https://www.shadcn-svelte.com) is a straight-up port of the popular [shadcn-ui](https://ui.shadcn.com) component library, which is “a collection of reusable components that you can copy and paste into your apps.” Now, that’s a value proposition for developers! Just note that the Svelte port is not developed by the same developer as the core offering. I’m not sure if the two are in touch to keep the libraries in sync, so that’s something you might consider when working with shadcn-svelte.

## Carbon Components Svelte

![ALT: Mosaic pattern from the Carbon Design System homepage showing pale geometric shapes.](https://paper-attachments.dropboxusercontent.com/s_78099A5AAB7FAD543254C74F65D20334229CC80157C488F1A36A2F83E05B096F_1704992731656_carbon-svelte-pattern.png)

If you haven’t seen IBM’s open-source [Carbon Design System](https://carbondesignsystem.com), it’s worth your time to look it over. It’s a complete collection of not only components, but patterns as well, and sports an active community where you can find even more assets. And, of course, [there is a version of it designed just for Svelte](https://carbon-components-svelte.onrender.com).

But, like shadcn, know that the port is by a different developer. And it’s still in its pre-1.0 phase, so that’s certainly worth considering as well since you’re likely to see changes between now and when it gets to 1.0.

## Skeleton UI

![ALT: Skeleton UI website header showing an illustrated skull with a crown.](https://paper-attachments.dropboxusercontent.com/s_78099A5AAB7FAD543254C74F65D20334229CC80157C488F1A36A2F83E05B096F_1704993414109_skeleton-ui-svelte.png)

[Skeleton UI](https://www.skeleton.dev) is another open-source toolkit built using Svelte and [Tailwind CSS](https://tailwindcss.com/). It is one of the more stable and popular Svelte component libraries out there. It’s got themes and design tokens that you can use to tweak the looks of your themes and UI. Skeleton is also built on Tailwind CSS so customization will be a lot easier.

## Markdown In Svelte

If you’re planning on writing content in Markdown in a Svelte app, then you’ll need some way to preprocess it on build so it parses as HTML. It’s not like there’s a shortage of options here, but [mdsvex](https://mdsvex.com/) is the one I keep coming back to. I’m not sure there’s something you’d need that it doesn’t have, but you might consider other popular options, like [svelte-markdoc-preprocess](https://svelte-markdoc-preprocess.pages.dev/documentation) and [svelte-markdown](https://github.com/pablo-abc/svelte-markdown) (which is a markdown parser rather than a preprocessor).

## CSS In Svelte

Svelte offers several methods to enhance the appearance of your components within a Svelte application, and you can even mix and match these methods for a customized approach.

### 1. CSS in Svelte Component

Indeed, the design of Svelte encourages a streamlined approach by allowing you to consolidate your JavaScript, HTML, and CSS within a single component file. This design language promotes modularity, making it easier to manage and understand the structure of your components.

Here's an example of how you can combine JavaScript, HTML, and CSS in a Svelte component:

```svelte
<script>
	let message = 'Hello, Svelte!';
</script>

<h1>{message}</h1>
<p>
	This is a Svelte component with integrated JavaScript and CSS. The design is modular, making it
	easy to manage.
</p>

<style>
	h1 {
		color: #ff6600;
		text-align: center;
	}

	p {
		font-size: 16px;
		line-height: 1.5;
		margin-top: 20px;
	}
</style>
```

The styles defined within the `<style>` tag are scoped to this particular component. This means that the styles for `h1` and `p` will only affect elements within this component and won't leak out to affect other parts of your application. This scoped styling helps maintain modularity and prevents unintended style conflicts across different components.

### 2. Global CSS

Svelte allows global CSS directly in components through importing, or you can opt for the conventional method of linking CSS to HTML for styling purposes.

Here is an example of importing Tailwind CSS files into your Svelte component:

```svelte
<script>
	import '../tailwind.css';
	import '../input.css';
</script>

/* +layout.svelte */
```

# Svelte (SvelteKit) Deployments

Once you’ve built your app, chances are you’re going to want the world to see it. There are a few extremely well-established players for deploying Svelte-based apps — as well as those based on other frameworks. What makes these the best deployment options around is how seamless it is push your work and ship it to a production environment, often with little to no configuration.

As with many things, your mileage may vary with any of the following services as your development environment may have specific needs and you may have your own personal preferences for how to ship your work.

But before we jump into the services, it’s worth considering whether or not you are using SvelteKit in your stack because it offers the same `npm run build` command to trigger builds for any standard Node.js application that can be hosted anywhere.

I also think it is worth taking a moment to wrap your mind around the **concept of adapters** if you are new to SvelteKit and are unfamiliar with them. The SvelteKit documentation [describes adapters](https://kit.svelte.dev/docs/adapters) nicely, calling them “small plugins that take the built app as input and generate output for deployment.”

And those small plugins are designed to connect you to a specific deployment service, taking the brunt of configuring things for you, so you are able to focus more on writing and pushing code than fiddling with deployments.

As of the time of this writing, there are SvelteKit adapters for the following services, in alphabetical order:

- AWS
- Azure
- Cloudflare Pages
- Cloudflare Workers
- DigitalOcean
- Heroku
- Netlify
- Node servers
- Static site generators
- Vercel

Note that the Node adapter makes it practically possible to deploy anywhere. And some of those services do not have a dedicated adapter, but make use of an `adapter-auto`. That said, adapters for specific services do provide affordances that allow you to leverage that service’s features. I want to focus on the three services I’ve grown to like most.

## Vercel

![ALT: Vercel website banner showing a 3D Vercel logo against a rainbow gradient.](https://paper-attachments.dropboxusercontent.com/s_78099A5AAB7FAD543254C74F65D20334229CC80157C488F1A36A2F83E05B096F_1705074704581_vercel-site-header.png)

[Vercel](https://vercel.com) is a great option for deployments. SvelteKit projects require absolitely no configuration to work with Vercel. Seriously, connect your repo with Vercel’s point-and-click interface and tell Vercel what to do.

That’s actually what you’ll get from other services, too. What makes Vercel great is everything it does for you _in addition_ to deployments, things like access to analytics, backups, reverting deployments, cache control, security, and the list goes on. My personal favorite feature is being able to [preview the branch](https://vercel.com/features/previews) before it is formally deployed.

As as setting things up, I recommend using the [@sveltejs/adapter-auto](https://github.com/sveltejs/kit/tree/main/packages/adapter-auto) adapter with the [@sveltejs/adapter-vercel](https://kit.svelte.dev/docs/adapter-vercel) adapter. The auto adapter does what it says and attempts to choose the right adapter for you based on where you are deploying, which can give you a little more stability and flexibility as far as what service you use. But it doesn’t accept options, you’ll need pair it with the Vercel adapter if you want to take advantage of more exciting Vercel features, such as [edge functions](https://vercel.com/products/managed-infrastructure).

```js
// svelte.config.js

import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	}
};
export default config;
```

## Cloudflare

![ALT: Cloudflare web banner illustrating a cloud connected to many services.](https://paper-attachments.dropboxusercontent.com/s_78099A5AAB7FAD543254C74F65D20334229CC80157C488F1A36A2F83E05B096F_1705075566825_cloudflare-web-banner.png)

Cloudflare is an amazing option for deploying your Svelte applications. Your app benefits from reduced latency, improved loading times, and global scalability. Additionally, Cloudflare's security services protect against online threats, while its analytics provide valuable insights into website performance.

Sveltekit also has official documentation on how to take advantage of Cloudflare features.

## Netlify

![](https://paper-attachments.dropboxusercontent.com/s_78099A5AAB7FAD543254C74F65D20334229CC80157C488F1A36A2F83E05B096F_1705076012936_netlify-video-poster.png)

Netlify is another option that seamlessly integrates into a SvelteKit project. In fact, it’s a lot like Vercel; so much so that you really cannot go wrong either way. Instead of using the Vercel adapter, you plug in the Netlify version, `[@sveltejs/adapter-netlify](https://kit.svelte.dev/docs/adapter-netlify)`. Like Vercel, you will still use the auto adapter for the base connection, but layering the Netlify adapter on top of it provides access to things like edge functions.

From the docs:

```js
// svelte.config.js

import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-netlify';

export default {
	kit: {
		// default options are shown
		adapter: adapter({
			// if true, will create a Netlify Edge Function rather
			// than using standard Node-based functions
			edge: false,

			// if true, will split your app into multiple functions
			// instead of creating a single one for the entire app.
			// if `edge` is true, this option cannot be used
			split: false
		})
	}
};
```

# Conclusion

That’s a roundup of my favorite tooling for Svelte projects. Notice that very little happens without SvelteKit added to the equation. Even though it’s totally possible to build with Svelte without SvelteKit, the kit really does provide the nuts and bolts you need to extend Svelte, not just with the goodies it provides, but with avenues for integrating with even more tooling, as we saw with the likes of deployments and page rendering options. I like to think of Svelte as the framework and SvelteKit as the power cord to plug it in.

The fact is that the Svelte community is growing and shipping new tools and experiments all the time. If you're looking to explore more Svelte packages and libraries, I highly recommend checking out the [Svelte Society Components page](https://sveltesociety.dev/components) as well as the [madewithsvelte](https://madewithsvelte.com/) site because they are regularly updated sand adding more items.
