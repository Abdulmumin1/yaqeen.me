---
title: 'Fisher Yates - How the popular shuffling Algorithm Works - Under The Hood'

description: 'There goes the algorithm visually, with all this information in check, we can implement this algorithm quite easily. I will be doing that with JavaScript, even though it not the most elegant language for a demo.'

date: '2024-05-10'

lastmod: '2024-05-10'

categories:
  - under the hood series

  - shuffling algorithm

  - fisher yates

label: 'under the hood series'

series: 'uth'

episode: 1

layout: series

published: true
---

## Intro;

Following my curiosity, I decided to try demystify new concepts, algorithms or just how things work behind the scenes every week. And It would make a lot more sense, if I even share those journeys with the community, so I decided to take it on.

In this **under the hood series**, I will be sharing what I’ve learned and how some algorithms or programs, or even just any cool concept (In programming of course) we use works behind the scenes.

> In the future titles or writing, I might sometimes refer to Under the hood series as “UTH” series.

For this week, we will be starting simple. I will be demystifying a really popular technique or algorithm most of us use to shuffle our arrays i.e the “Fisher Yates or Knuth Algorithm”.

## Fisher Yates?

Fisher Yates is not actually one person, it was coined after [Ronald](https://en.wikipedia.org/wiki/Ronald_Fisher) [**Fisher**](https://en.wikipedia.org/wiki/Ronald_Fisher) and [Frank](https://en.wikipedia.org/wiki/Frank_Yates) [**Yates**](https://en.wikipedia.org/wiki/Frank_Yates), who developed the original idea of the algorithm, which was later modified a bit for efficiency by [Donald Knuth](https://en.wikipedia.org/wiki/Donald_Knuth), hence the alternate name **- Knuth shuffle.**

Here’s is a high level detail of how it works:

- Step 1. Having all the element you want to shuffle (needs to be finite of course), create a separate list to store the shuffled elements (let call it the output list).
- Step 2. Select an element X randomly from the list and add it to the output list, then mark X as visited.
- Step 3. Repeat the previous step (i.e Step 2) until all elements are visited.
- Step 4. End the process

… and a shuffled list has been obtained. This is definitionally the solution most of us would intuitively think of and if you’ve implemented such before, well, now you know what it is called.

Let try to visualize this with some diagram:

| Array                               | Output list   |
| ----------------------------------- | ------------- |
| [ F, I, S, H, E, R, Y, A, T, E, S ] | []            |
| [ F, I, S, H, E, R, Y, A, T, E, S ] | [S]           |
| [ F, I, S, H, E, R, Y, A, T, E, - ] | [SI]          |
| [ F, -, S, H, E, R, Y, A, T, E, - ] | [SIH]         |
| [ F, -, S, -, E, R, Y, A, T, E, - ] | [SIHR]        |
| [ F, -, S, -, E, -, Y, A, T, E, - ] | [SIHRA]       |
| [ F, -, S, -, E, -, Y, -, T, E, - ] | [SIHRAF]      |
| [ -, -, S, -, E, -, Y, -, T, E, - ] | [SIHRAFE]     |
| [ -, -, S, -, E, -, Y, -, T, -, - ] | [SIHRAFEY]    |
| [ -, -, S, -, E, -, -, -, T, -, - ] | [SIHRAFEYE]   |
| [ -, -, S, -, -, -, -, -, T, -, - ] | [SIHRAFEYET]  |
| [ -, -, S, -, -, -, -, -, -, -, - ] | [SIHRAFEYETS] |
| [ -, -, -, -, -, -, -, -, -, -, - ] |               |

There goes the algorithm visually. Now, with all this information in check, we can implement this algorithm quite easily.

I will be doing that with JavaScript, even though it not the most elegant language for a demo.

Firstly some boilerplate:

```js
let arr = [];

function shuffle(arr) {}
```

Then in our function, we will create a new array.

```js
function shuffle(arr) {
	let shuffled_array = [];
}
```

we will then randomly select from our original array to the shuffled array. But before that, as seen in the description, we will not be modifying our original array whenever we pick a random value, but rather mark that spot as visited, so we will need another array to store visited indexes/positions.

Hence our solution will look more like this:

```js
function shuffle(arr) {
	let shuffled_array = [];
	let visited = new Array(arr.length).fill(false);

	for (let i = 0; i < arr.length; i++) {
		let j = Math.floor(Math.random() * arr.length);

		while (visited[j]) {
			j = Math.floor(Math.random() * arr.length);
		}
		shuffled_array.push(arr[j]);
		visited[j] = true;
	}

	return shuffled_array;
}
```

Finally, Let test out our little algorithm to see if it works:

```js
let yates = ['F', 'I', 'S', 'H', 'E', 'R', 'Y', 'A', 'T', 'E', 'S'];
let shuffled = shuffle(yates);
console.log(shuffled);
```

Random output I got after testing:

```txt
// ["I","A","T","Y","F","R","E","H","S","E","S"];
```

## Not very efficient, Right?

As you can see, from the implementation we can guess that this method might not do well with large inputs, due to the step where we initialized another loop to pick another element if that randomly selected one has previously been visited.

This makes the time complexity O(n2), which is not great, adding to the fact that we introduced a bunch of new arrays. This issue is what [Donald Knuth](https://en.wikipedia.org/wiki/Donald_Knuth)’s variant addresses.

## Donald Knuth’s Solution

While following the same principle as the Fisher Yates, Knuth’s variant makes the algorithm more efficient, getting rid of the additional arrays required in the process, also reducing the time complexity to just `O(n)`.

Knuth’s variant looks like this:

- Step 1. Select an element X randomly ( index between 0 and I (inclusive), where I is the current Index ) from the list and swap it position with the last element in the list.
- Step 2. Repeat the previous step (i.e Step 2) for the ‘n’ number of elements in the list.
- Step 3. End the process, The resulted list is our shuffled list.

Shuffling in the Knuth's variant is done from lowest index to the highest index of the array.

| Original Array  | Random Index | Shuffled Array  |
| --------------- | ------------ | --------------- |
| [K, N, U, T, H] | 1            | [N, K, U, T, H] |
| [N, K, U, T, H] | 3            | [N, T, U, K, H] |
| [N, T, U, K, H] | 2            | [N, T, H, K, U] |
| [N, T, H, K, U] | 3            | [N, T, K, H, U] |
| [N, T, K, H, U] | -            | [N, T, K, H, U] |

With all that, let see what the implementation looks like:

```js
function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}
```

This version looks alot better, and also less code? yes please!

In this implementation, it is important to note that we are getting from the range of `0 - i+1`, where `i` is the current iteration, and `+1` means to include `i`.

That is to say, when:

i = arr.length (9 for example)
we will be picking a random number for `0` to `9`;

![randomly select from 0 - 9; fisher yates knuth’s variant.](https://paper-attachments.dropboxusercontent.com/s_03F60933FA393E3D4E7330BB1E2EFE2A8F83B9B12C58C30595B17EBEB06CAB9D_1715323296339_Copy+of+Getting+Started+with+DynamoDB.png)

Then when `i` is `8`;
The range will be from `0` - `8`

![randomly select from 0 - 8; fisher yates knuth’s variant.](https://paper-attachments.dropboxusercontent.com/s_03F60933FA393E3D4E7330BB1E2EFE2A8F83B9B12C58C30595B17EBEB06CAB9D_1715193262861_3.png)

Then when `i` is `7`:

![randomly select from 0 - 7; fisher yates knuth’s variant.](https://paper-attachments.dropboxusercontent.com/s_03F60933FA393E3D4E7330BB1E2EFE2A8F83B9B12C58C30595B17EBEB06CAB9D_1715193268921_4.png)

Until the end.

That effectively sums up the Fisher Yates algorithm and also this weeks Under the wood episode.

Super hope you learn something new and interesting as I did.

**What I’m currently working on:**

**DevCanvas** - an online editor with super powers, fast preview, plugins and super cool library of cool Frontend creations for your inspiration.

Try devcanvas @ [devcanvas.art/new](https://devcanvas.art/new)

**Stay super awesome 🫶🏾.**
