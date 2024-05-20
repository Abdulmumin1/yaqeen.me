---
title: 'How I animated my sorting Algorithm visualizer'

description: 'If you’re to do this with CSS, you will find it almost impossible if what you’re changing is not a CSS property. With the recent development in view-transitions-api, we’re moving to a phase were it going to become easier to do this.'

date: '2024-01-14'

lastmod: '2024-01-17'

categories:
  - svelte
  - transition
  - tips

thumbnail: 'https://cdn.hashnode.com/res/hashnode/image/upload/v1705306342282/203b7eb8-84fe-470a-949b-0df7288f6ce3.png'

label: 'Interactive blog'

published: true
---

<script>
  import Crossfadebubble from '$lib/demos/crossfadeBubble.svelte'
  import ViewTransitionEnabled from '$lib/demos/viewTransitionEnabled.svelte'

</script>

Recently I did something I have been wanting to do for a while now, and it has honestly been stuck in my head for the past 2+ years, but I never got to implement it, up until recently.

Getting to put out the initial contents for DevCanvas (online HTML/CSS/JS editor), which i’m currently working on, gave me the motivation to experiment with creating the algorithm visualizer.

Also It happens to be a great time for building on the web, and lots of things that manually used to be done are now been adopted natively by browsers. Which brings me to the whole point of this article - **View Transitions API.**

The view-transitions-api has been in the works for some while in and still in an experimental stage, but hype has only started to grow recently, which has also brought my attention to it.

## What is View Transitions API

The API was introduced to solve need to transition between states. it has never been easy to perform this transitions, and often required a lot of work and verbosity, just to make the user experience a little nicer.

Setting this up by ourselves takes lots of our precious time, and often not perfect and flawed heavily in some ways. Although Svelte (my most beloved framework) has a solution for this, the view transitions once fully ready and supported will make things super easier.

Nevertheless, we are going to dive in and take a looks at how it works and how I achieved the magic of smooth transition in my sorting algorithm visualizer.

## How it works

The view-transition-api has been said to capture the before and after state of a DOM, and smoothly perform the corresponding transition.

## How I created the visualizer

The breakdown of the steps is has follows:

- Create some kind of bars with the array
- At every completed action in the sorting algorithm, replace the old bars with the new array.

This is the entire plan, and with my little knowledge in JavaScript and CSS, I don’t know how I can ever be able to animate that. Thankfully, I’m part of the luckier generations, and I have the view-transitions-api.

One super interesting fact about this is that, the entire transition of this is not more that two lines, maybe three to be fair.

There are two functions involved in creating the visualizer:

1. **Updating the DOM**

This function takes in the array which is the global data, create the bars and append them to there position

```js
function renderChart() {
	chartContainer.innerHTML = '';
	const maxValue = Math.max(...data);
	data.forEach((value) => {
		const bar = document.createElement('div');
		bar.classList.add('bar');
		bar.style.setProperty('--tag', `bar-${value}`);
		const percentageHeight = (value / maxValue) * 100;
		bar.style.height = `${percentageHeight}%`;
		bar.textContent = value;
		chartContainer.appendChild(bar);
	});
}
```

One step of the transition is in this function `bar.style.setProperty('--tag',bar-${value})` which set a custom tag for each of the bars. using bar-WHATEVER-THE NUMBER-IS. This value has be unique, which is going to be the identifier that tells our browser, what moved where, or how to do the math.

2. **The Sorting Algorithm.**

```js
async function bubbleSortWithDelay(arr) {
	const len = arr.length;
	let swapped;
	async function sort() {
		do {
			swapped = false;
			for (let i = 0; i < len - 1; i++) {
				if (arr[i] > arr[i + 1]) {
					const temp = arr[i];
					arr[i] = arr[i + 1];
					arr[i + 1] = temp;
					swapped = true;
					console.log(arr); // Log array after each swap
					const transition = document.startViewTransition(() => renderChart());
					await delay(speed); // Delay in milliseconds (adjust as needed)
				}
			}
		} while (swapped);
	}
	return sort().then(() => arr);
}
```

I choose bubble sort here, just because it a little bit easier to see what going on more clearly.

Diving into this function, what you first encounter is the extra step that adds the delay, which is a `setTimeout` function, this helps create the interval between the loops, hence used to increase or decrease the speed of the visualizer.

Also in this function is the view-transitions-api called. `const transition = document.startViewTransition(() => renderChart())`.

The `startViewTransition` instantly captures the current state of our DOM, and the function from before `renderChart()` updates the DOM.

This sums up the entire logic for the visualizer and also the transition.

If stop here, we will get a cross-fade between the previous and the after state, and the looks super weird. we want an individual transition of the bars, rather than the entire stuff.

<div>
	<Crossfadebubble/>
</div>

So we can fix this by adding `view-transition-name`, this will tell the browser about that individual bar, and will automatically animate to it new position if it changes.

```css
.bar {
	view-transition-name: var(--tag);
}
```

And you can see that I’m using the tag we added to the bars earlier.

So now, when the DOM is updated, the view transitions-api sees some like this:
let say `--bar-23` is in the first position in the array, when the loop goes, it new position moved to 4th, the api can smooth calculate and do the movement magic for us.

<div>
	<ViewTransitionEnabled/>
</div>

Here is the final result of the visualizer, again if you’re on an unsupported browser, like Safari and Firefox, this will not work.

<iframe
                title="embed"
                src="https://snippet-bice.vercel.app/play/Obw8iQ/embed"
                frameborder="0"
                height="600px"
                width="100%"
                loading="lazy"  
/>

**Peace ✌️**

**View Transitions on MDN docs**: [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
