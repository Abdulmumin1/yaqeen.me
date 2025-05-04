---
title: 'kbar-svelte-mini - ctrl+k menu for your Svelte website'

description: 'A super duper lightweight package to easily implement a disposable navigation (ctr+k/cmd+k navigation or menu) system for your Svelte application. To build this package, I set out with three (3) goals in mind.'

date: '2024-02-10'

lastmod: '2024-02-10'

categories:
  - product launch
  - sveltekit
  - npm
  - kbar

label: 'Product launch'

published: true
---

Recently I was working on a project, and I want to have the super nice ctrl+k or cmd+k (for mac users) navigation/menu on the website, but there is a problem, similar to why most use [shadcn-ui](https://ui.shadcn.com/), I also want something that is gives great result with less effort.

I stumbled across a super powerful packages that will help me with the implementation ([cmdk](https://www.cmdk-sv.com/)), and I love It to be honest, but then I have to do alot of manual work, which feels like a lot considering that I’m just trying to build a simple menu system and not some complicated or god mod kind of menu.

The nice one I found that could do this is, [kbar](https://kbar.vercel.app/), and It cool, but I use Svelte not React. Lucky for us Svelte devs, I took on the job to port something similar to Svelte, a package that Is designed to just be plugged and played.

## Introducing kbar-svelte-mini;

A super duper lightweight package to easily implement a disposable navigation (ctr+k/cmd+k navigation or menu) system for your Svelte application.

To build this package, I set out with three (3) goals in mind:

- Easy to Implement,
- Should be customizable,
- and ofcouse, be super accessible.

### Easy to Implement;

The solution I came up with, also credits to [kbar](https://kbar.vercel.app/), Is for you to only think about the structure of your actions or you can call it menu. We should be able to take care of the rest. The result of that:

**Install kbar-svelte-mini;**

```bash
npm i kbar-svelte-mini
```

**In your root** `+layout.svelte`

```js
import { KDialog } from 'kbar-svelte-mini';
```

**Define your actions**

```js
let actions = {
	title: 'Home',
	subtitle: 'Subtitle if needed',
	callback: () => {
		window.location.href = '/';
	}
};
```

Nested actions:

```js
let actions = {
	title: 'Change Theme',
	nested: [
		{
			title: 'Light',
			callback: () => {
				changeMode('light');
			}
		},
		{
			title: 'Dark',
			callback: () => {
				changeMode('Dark');
			}
		}
	]
};
```

Finally, you can pass those actions to the component:

```svelte
<KDialog {actions} />
```

The result:

![Kbar-svelte-mini demo](https://paper-attachments.dropboxusercontent.com/s_A1CBA09559F628565D0B6DD8F43F54B5023D16EE68ECDDF4B3F0E2204C58A5C5_1707512315038_kbar-demo.gif)

With this simple setup, you have a universally available `ctrl+k/cmd+k` with super good styling for your website. Also the universal search is just dope, It can hunt any action no matter how deeply nested It Is, In a lightning speed.

### Should be “Customizable”;

While I was going to make it the easiest thing to Implement, It Is also Important to address the Issue with the default design blending in with the rest of your application.

The method I choose for this is using custom variables, so you can customize what is necessary, Apple’s way, Anyone?

Available options are:

- `--bg`: Change the background to fit your application.
- `--kbar-primary`: Primary color for your app, used for text and border highlight.
- `--kbar-gray`: Color for dimmed texts.
- `--kbar-search`: Search bar text color, primary color used in the absence.
- `--shadow`: Control the shadow of the dialog.

**Example:**

For the menu on my website [yaqeen.me](https://yaqeen.me/), Here are the colors for it.

```svelte
<KDialog
	{actions}
	--bg={'#1c1917'}
	--kbar-primary={'#f97316'}
	--kbar-gray={'#1c1917'}
	--shadow={'0px 0px 0px black'}
/>
```

I disabled the shadow for mine, due to my no shadow designs.

![kbar-svelte-mini demo yaqeen.me](https://paper-attachments.dropboxusercontent.com/s_A1CBA09559F628565D0B6DD8F43F54B5023D16EE68ECDDF4B3F0E2204C58A5C5_1707512428618_kbar-yaqeen.gif)

> The naming is quite weird, I didn't give it much thought when building, apologies 🙏.

### Super Accessible;

This is really Important when building a UI component package of any kind, you’re obliged to take care of this, I could not escape either.

Also, another aspect to this is keyboard navigation, since the original goal of this navigation system, I believe is to give a mouse free experience.

The way it works on kbar-svelte-mini is:

- Focus the first item, either when you open the dialog, or when you search,
- Hovering on Item/action, It moves the focus to that Item.
- You can use the up/down arrow keys to navigate up/down.

Yo, there you have it! kbar-svelte-mini 🎉, Looking forward to exciting stuff you guys are going to build with this.

Want to Improve kbar-svelte-mini? Use GitHub Issues, Pull Request, send me a DM, email, however you like it.

**Docs:** https://kbar-mini.vercel.app/

**Github**: https://github.com/Abdulmumin1/kbar-svelte-mini

**Shout out to**: [kamal](https://vector-walls.vercel.app/) from [@rockpadStudios](https://twitter.com/@Rockpadstudios), [@timcchang](https://twitter.com/timcchang), [@huntabyte](https://twitter.com/huntabyte), [@winnerfavour](https://twitter.com/winnerfavour).

**Peace ✌️**
