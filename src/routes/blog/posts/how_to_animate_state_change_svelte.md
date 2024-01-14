---
title: 'How to animate state change in Svelte'

description: 'If you’re to do this with CSS, you will find it almost impossible if what you’re changing is not a CSS property. With the recent development in view-transitions-api, we’re moving to a phase were it going to become easier to do this.'

date: '2024-01-11'

categories:
  - svelte
  - transition
  - tips

thumbnail: 'https://cdn.hashnode.com/res/hashnode/image/upload/v1705009291855/6247f945-a075-4916-8af7-9ae1ca31f235.png'

published: true
---

<script>
	import BlogCarousel from '$lib/demos/blogCoursel.svelte'
</script>

Svelte is amazing, and in this article we will go through how you can animation/transition between components in svelte.

If you’re to do this with CSS, you will find it almost impossible if what you’re changing is not a CSS property. With the recent development in view-transitions-api, we’re moving to a phase were it going to become easier to do this.

## How?

we can achieve this with the `{#key …}` block, which is part of the super useful list of logic blocks Svelte provides.

> view the complete list of logic blocks [here](https://svelte.dev/docs/logic-blocks)

The `{#key …}` is not built specifically for animating or transition, but it **listens** to changes in the **expression changes** and it destroys and recreate it content whenever the **expression changes** changes.

With this advantage, we can create a transition either using svelte built in transitions capabilities or make a custom one with CSS.

**Example**

This simple syntax for this is:

```svelte
{#key value}
	<div transition:fade>{value}</div>
{/key}
```

Here we are going to wrap our content around the key and we’re going apply a slide transition whenever the `image` changes.

```svelte {18,19,22}
<script>
	let images = ['/carousel.png', '/carousel1.png', '/carousel2.png', '/carousel3.png'];

	let currentIndex = 0;
	let image = images[currentIndex];

	onMount(() => {
		// Start the carousel
		interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
			image = images[image];
		}, 3000);
	});
</script>

<div>
	<div>
		{#key image}
			<div transition:slide>
				<img src={image} alt="" />
			</div>
		{/key}
	</div>
</div>
```

<BlogCarousel/>

One thing I want to clarify is that, in both examples, no just values can be passed to the key, you can also feed it an **expression**, and will perform the same.

Svelte is beautiful, I love it, if you’re here, you definitely love it too. Share the knowledge with others that might find it useful.

**Peace** ✌️
