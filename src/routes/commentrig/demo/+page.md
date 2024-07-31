<script>
	import { Comment } from '@commentrig/svelte';
	import '@commentrig/core/styles/default.css';
	let entities = {
		title: 'CommentRig Demo Page',
		email: 'abdulmuminyqn@gmail.com',
		unique_id: 'commentrig-demo-page',
		rich: true,
		page: 100,
		domain: 'https://www.yaqeen.me'
	};
</script>

Triming plaintext is fairly an easy algorithm to write, and we rely on it soo much more than we think. Doing the same for rich text however is a bit of a different kettle of fish, spaces are not whitespace but instead a `<b/>` or linebreaks to say.

No gainsaying the fact that we can't always trust users to do the right thing, things which might seem obvious to you (since you're the ones building it), are not so obvious to them. Even worse is that they will be thinking it's not their fault, hence why we go out of our way to build features to guardrail this.

This is a problem i ran into building commentrig ([Join the waitlist here](https://www.commentrig.com)) a one minute robust comment system integration into your website. I needed a way to trim out extra and unnecessary spaces/linebreaks outside and between paragraphs.

![Text in a comment box with excess line breaks](https://paper-attachments.dropboxusercontent.com/s_7C51D412F35D5EE32D7FA12E66F1AB07F248DD0FB86E6C0AF80EC2DBF81A39DD_1721925070940_Screenshot+2024-07-25+at+12-47-22+Vite+React.png)

![Trimmed and untrimmed version of the latter text](https://paper-attachments.dropboxusercontent.com/s_7C51D412F35D5EE32D7FA12E66F1AB07F248DD0FB86E6C0AF80EC2DBF81A39DD_1721925082228_beforeafter.png)

In this weeks under the hood series, I want to talk about this algorithm I came up with that helped me solve the problem, hopefully helping you in your needs as well, or helping me find fault in my solution.

## The idea.

The idea is very simple, and it goes like this:

1. **1.** Create a variable to mark the top (i.e the point where text does not have any space above it)

2. **2.** Also create a list to store nodes that we're removing (removables 😅).
3. **3.** Iterate through all the nodes.
4. **4.** If the text content of the current node (x) is empty:
5. **5.** Check if the next sibling (x+1) is also empty, if true, remove the current node (x) (add it to the removables)
6. **6.** Else if it is the last index, (meaning no next sibling), remove it (add it to the removables).
7. **7.** Else if the next sibling is not empty, since the current index (x) is empty we will mark that as our top, but also mark it as a removable top. **_Top can only be set once._**
8. **8.** Else if the text content of the current node (x) is not empty: we mark it as our top, but a none removable top. **_Top can only be set once._**
9. **9.** After the iteration is complete, we loop over our list of removables, and remove corresponding elements from our original node. Also if our top is an element (removable top), we remove it as well, but if the set to True (non removable top) we leave it alone.

You can already tell it interesting, or you can spend some time to think it over to fully understand it. But my breakdown goes like this:

## Breakdown

The first part of the algorithm, `Create a variable to mark the top`. The reason for this variable, is solely to remove the extra space that will be present at the top of the content, as the check will not remove anything that the next sibling is a text content. I will also explain why is that.

**Moving forward** is to create a list to store the nodes we're going to be removing. This solves a fundamental problem, because if we remove directly from our node while iterating, it reduces our iteration count. Hence the list. Otherwise we might as well get rid of the top variable we're creating, because we can always check with `node.firstChildElement`.

**Next** we're checking if the text content is empty, this should be it if not that, we don't want all spaces/linebreak in between paragraphs should be gone as well. At lease we will respect the intention to leave a space between paragraphs, but not excess. Hence why we're checking the next sibling is a space as well, otherwise, it should be the only space that remains.

![Illustration showing removing spaces removing extra spaces/line breaks between text](https://paper-attachments.dropboxusercontent.com/s_7C51D412F35D5EE32D7FA12E66F1AB07F248DD0FB86E6C0AF80EC2DBF81A39DD_1721925122634_Some+Text.gif)

**Inside of the same condition** `text content of the current node (x) is empty` we're checking if it is the last index or not, because the last child does not have a nextSibling. but we already know that current node is empty, so we just add it to our list of removables.

![a gif showing a logic to remove the extra space/linebreak in the last index](https://paper-attachments.dropboxusercontent.com/s_7C51D412F35D5EE32D7FA12E66F1AB07F248DD0FB86E6C0AF80EC2DBF81A39DD_1721925137363_Some+Text1.gif)

**Still here** `text content of the current node (x) is empty`, we want to find our top which will trigger if the nextSibling is not empty and **_if our top is not already set yet_** (very important line). But we know that the current node is empty, hence we set it as our top, but a removable one.

![A gif showing how the “top” of the node is determined if there is an extra space/linebreak that precedes it](https://paper-attachments.dropboxusercontent.com/s_7C51D412F35D5EE32D7FA12E66F1AB07F248DD0FB86E6C0AF80EC2DBF81A39DD_1721925151010_Untitled+design3.gif)

**Moving our of this condition** `text content of the current node (x) is empty`, which means that we've encountered an element the is not empty, then we set it as our top (**_if our top is not already set yet_**), but a non removable one, meaning we will just mark to as `True`

![A git showing how the top is determined if there is no extra space/linebreak preceding it](https://paper-attachments.dropboxusercontent.com/s_7C51D412F35D5EE32D7FA12E66F1AB07F248DD0FB86E6C0AF80EC2DBF81A39DD_1721925166030_yaqeen.me.gif)

Once the iteration is done, we loop over our list of removables, and remove corresponding elements from our original node. Also if our top is an element (removable top), we remove it as well, but if the set to True (non removable top) we leave it alone (we can't remove that anyways).
Here is a rough illustration of how everything comes together:

![A step by step walk through showing the rich text trimming algorithm in action](https://paper-attachments.dropboxusercontent.com/s_7C51D412F35D5EE32D7FA12E66F1AB07F248DD0FB86E6C0AF80EC2DBF81A39DD_1721925179672_yaqeen.me2.gif)

> Forgive my editing skills 😅.

## Code

```js
function trimCommentContent(htmlString) {
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = htmlString;

	let removeList = [];
	let emptyTagNames = ['BR', 'STRONG', 'EM'];

	function removeEmptyNodes(element) {
		let elements = element.childNodes;
		let top = null;
		for (let index = 0; index < elements.length; index++) {
			const e = elements[index];
			if (e.textContent.trim() == '') {
				if (e.firstChild.tagName == 'BR') {
					if (
						e.nextElementSibling?.textContent.trim() == '' &&
						emptyTagNames.some((t) => e.nextElementSibling?.firstChild.tagName == t)
					) {
						removeList.push(e);
					} else if (index == elements.length - 1) {
						removeList.push(e);
					} else if (!top) {
						top = e;
					}
				}
			} else {
				if (!top) {
					top = true;
				}
			}
		}

		removeList.forEach((element) => {
			tempDiv.removeChild(element);
		});
		if (top && top !== true) {
			tempDiv.removeChild(top);
		}
		removeList = [];
	}

	removeEmptyNodes(tempDiv);
	return tempDiv.innerHTML;
}
```

You can further study the code to understand it better. I'm hoping for a feedback on potential flaws in my implementation, or even a better one.
Super hoped you learned something new as I did.

**Before you go:**

I’m building [commentrig](https://www.commentrig.com), a platform that allow you to integrate a robust comment system to your website. Offering a native package for all your favorite frameworks.
Join the waitlist here: [commentrig.com/waitlist](https://www.commentrig.com/waitlist)

**Stay Super Awesome 🫶🏾.**

<div class="p-12">
	<Comment {entities} />
</div>

<style>
	:root {
		--rig-text-color: #404953;
		--rig-background-color: #0c0a09;
		--rig-color-primary: #c2410c;
		--rig-inactive-color: #78716c;
	}
</style>
