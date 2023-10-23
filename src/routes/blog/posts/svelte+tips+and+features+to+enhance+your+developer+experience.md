---
title: Things svelte just do better!

description: post description

date: '2023-10-23'

categories:
  - svelte

  - webdev

  - tips

published: true
---

If you're using Svelte, you're likely already enamored by its awesomeness. For both developers and users, the experience of working on a Svelte app or interacting with one is truly exceptional. But what's even more exciting is the potential to elevate this experience to new heights. In the world of Svelte, there's always another level to explore, much like in life, where ease and challenges continually reveal new layers of complexity and simplicity.

Svelte has a framework, with the power of its compiler, that allows you to do less with more, but sometimes you get to dig a little to find these gems, There might be features you're unaware of or aspects you never thought possible, but they're there, waiting to be discovered!

In this article, I will showcase a selection of fascinating Svelte features I've come across. Whether you're already familiar with them or not, I encourage you to stay until the end; you're sure to take away valuable insights.

## Svelte Actions

When I say Svelte actions, I do not mean form actions. Svelte actions are just regular functions you can attach to an element and get called when that element is created. The function will include a reference to the element and you can mess with the element however you want.

Actions can be used when you want to perform a sequence of actions on an element when it is initialized, let's say add a bunch of event listeners, animations, and others and maybe you want something action that can be reusable, then svelte action should definitely be your goto method.

An exciting use case I've recently done is using Svelte action to add tooltips to elements. I don't know about you, but for me personally, tooltips are very annoying to configure, especially when you're not using a component library of some sort. It is just an extra hassle added to your development experience.

Well, grieve no more, because you can easily manipulate any element with svelte actions, Let see how it is done:

*To manipulate* an element with a Svelte action, you first need to create an action function. This function will take the element as a parameter and perform the desired manipulation.

Once you have created the action function, you can attach it to an element using the `use:action` directive. This directive takes the name of the action function as a parameter.

When the element is mounted, the action function will be called with the element as a parameter. You can then use the element object to manipulate the element in any way you want.

Here is an example of a simple action function that scrolls an element to the top:

```js
function addTooltip(element) {
    // element.classList.add('relative');
    const container = document.createElement('div');
    container.classList = 'relative';
    const tooltip = document.createElement('div');
    const newElement = element.cloneNode(true);
    tooltip.classList = 'p-2 bg-orange-100 rounded-xl absolute bottom-[100%]  w-[200px] hidden m-2';
    tooltip.innerText = 'this is a tooltip';

    container.appendChild(tooltip);
    container.appendChild(newElement);

    element.parentElement.replaceChild(container, element);

    newElement.addEventListener('mouseover', (event) => {
        tooltip.classList.remove('hidden');
    });
    newElement.addEventListener('mouseout', (event) => {
        tooltip.classList.add('hidden');
    });
}
```

To use this action function, you would attach it to an element like this:

```html
<div use:addTooltip>
  show tooltip
</div>
```

When the element is mounted, the `addTooltip` function will be called and the element will be replaced with a container that contains the original element and a tooltip.

Actions can be used to manipulate elements in many different ways. It is a super powerful feature of Svelte that so many don't know about, or just don't give it a chance.

The possibilities with actions are endless!

## Aliases

Sometimes, auto-import doesn't cooperate. If you've encountered this issue, you can probably empathize with the frustration. The quest to locate the parents, subdirectories, and nested components, or even other files you're seeking, can be quite taxing – especially when you're deeply nested in your project. Most of the time, we guess it wrong on the first trial and end up spending a handful of time trying to figure out where.

Or maybe you just want a cleaner-looking import. Believe it or not, Imports takes up a pretty handful of lines or code in projects, and you've probably always tried to implement the best practices of sorting them. Aliases can be a really cool one you can configure to reduce the noise in your import by a bit.

In `SvelteKit`, there is already a default alias added to the `src/lib/` that is `$lib` which you know has been very useful, and you populate your aliases as much as you want to make your experience a little bit better.

Let's see how it is done:

In this example, we're going to create an alias for our components folder, In your `svelte.config.js`

```json
{
    aliases: {
        "$components":"./src/components"
    }    
}
```

And just so you know, you're aliases can be recognized by your editor and auto import will be able to use that as well.

Your imports will quickly transform, becoming more easier to navigate and also more elegant:

```js
// Before
import SomeComponent from '../../../../components/someComponent'

// After
import SomeComponent from '$components/someComponent'
```

## Toggle Class

So in svelte everything is reactive, and we've seen, we've experienced it and we fell in love. And even more, you've probably used some of its syntactic sugar, it also has the most elegant and easiest way of binding element attributes and listeners using  `bind:WHATEVER`.

But then, what do I mean by toggle class? Well you know not all the tiny cool features get a name, they are all under the syntactic sugar umbrella, so that's what I just decided to call it *toggle class*, you can call it whatever you like. This feature is also part of the super amazing syntactic sugars of svelte.

This is a method of adding or removing a class from an element depending on the truth value of something. Let's say you have some element and you want to change its background color to red when some variable is false or green when the variable is true.

This is where `"Toggle class"` as I call it comes in, you can remove a class or add, just like the normal way of doing it with javascript (`classList.toggle(SOMECLASS)`).

Let's see how it done in action:

```html
<script>
    let buttonSucces = false

    function toggle(){
        buttonSucces = !buttonSuces
}
</script>

<button 
class="p-3 rounded-xl" 
class:bg-blue={buttonSucces} 
class:bg-red={!buttonSucces}
on:click={toggle}
>
Click
</button>


<style>

.p-3{
    padding: 2.5rem
}
.rounded-xl{
    border-radius:3.5rem;
}
.bg-blue{
    background-color:blue;
}
.bg-red{
    background-color:red;
}

</style>
```

What I have done here is really simple, so when we click, we should be able to see the background color toggle between blue and red.

This is a very awesome way of handling this and we can do it so much better than having to do something as simple as toggling a class with javascript.

## Async/Await Block

Most of the time when building something that requires you to fetch some data across the internet, there is always a promise involved, and It comes in handy especially when you're using the data to be returned to update the UI using Svelte `async/await` tag.

I also think this is one of the least popular ones, especially among beginners in Svelte, you've probably used others like the each and if block, which are used for iterating and logic respectively. All of these are powered by Svelte's reactive nature.

The async block, just like any other, allows you to pass a promise function that you can await. But not in the way you think.

You see, you can have some UI displayed before the Promise is fulfilled and get access to that data when the Promise is fulfilled, you can then update the UI with the data.

All this sounds complicated when I'm explaining it (I made it sound so), but wait until you see how Svelte handles this:

```js
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms)).then(() => 'completed');
}
```

```js
{#await sleep(3000)}
    <p>Loading</p>
{:then sleep_completed} 
     <p>Sleep Status: {sleep_completed}!</p>
{/await}
```

Surprised? Yeah, that's it, Your UI will show loading and when it is completed, it will show Show what you intended and also give you the returned data in a super cool way. You can literally use anything to catch your returned data, which is sweet for keeping your code readable.

You can already see how this can help you build work faster, especially when you're in the case of configuring a skeleton loader.

There is also a catch block in case of any error you will want to show a message for.

```js
{#await sleep(3000)}
    <p>Loading</p>
{:then sleep_completed} 
    <p>Sleep Status: {sleep_completed}!</p>
{:catch someError}
    <p> Unable to complete action </p>
    {someError.message}
{/await}
```

Overall, Svelte's design is all about boosting productivity, embracing elegance, and getting your projects out the door quickly. I can't stress enough how much I adore this framework. It lets you create virtually anything that's outside the norm, and it does so with remarkable ease, thanks to the magic of its compiler.

If you're not already a Svelte enthusiast and have stumbled upon this article, I wholeheartedly encourage you to give Svelte a whirl. Believe me, if you're open to new tools, you'll fall in love with Svelte and never look back.

## Happy Coding!
