---
title: 'Built a super duper fast html to markdown'

description: "i made h-to-md, a tiny html to markdown converter that is stupid fast and doesn't make you bring a browser to the party."

date: '2026-04-25'

lastmod: '2026-04-25'

categories:
  - tools
  - javascript
  - experiments

published: true
---

so i made a new project called [h-to-md](https://github.com/Abdulmumin1/h-to-md).

it is basically a html to markdown converter.

but i didn't want the usual "install half the universe just to convert a page" kind of thing.

i wanted something small, zero deps and duper fast. got the clanker to work (gpt 5.5 great model btw)

and, h-to-md happened.

it takes html and turns it into markdown.

no browser dom,
no weird third part bottleneck,
brutally fast (sub 30ms for 5mb html was the goal),
just convert the thing and move on


some have been pushing a standard for agents to negotiate html pages as mardown instead when needed.. you know to save token. and they are right.

<span data-highlight>markdown is cleaner, it is easier to scan, and would not pollute content with uncessary headers, tags, and script files the agent don't need.</span>

cloudflare has a proxy that does this at edge, but only avail in pro domain teir.

the whole thing is pretty small (less than 26kb)

```ts
import { htmlToMarkdown } from 'h-to-md';

const markdown = htmlToMarkdown('<h1>Hello</h1><p><strong>fast</strong> output.</p>');
```

or use tubo for aggressive speed.


```ts
import { htmlToMarkdownTurbo } from 'h-to-md';
```

and that's the vibe.

<span data-highlight>you give it html. it gives you markdown.</span>


also the benchmarks looks great:

![h-to-md benchmarks on turbo vs normal](https://mac-file.yaqeen.me/AF9627E4-eb840627be97dc864b634c5ad734db0f2b8161cc7b7a47f58352e911e4603fd2.png)

62 mb of html per second is insane "(0-0)"


anyways, if you want to check it out: [Abdulmumin1/h-to-md](https://github.com/Abdulmumin1/h-to-md)

and yeah, that is h-to-md.

super duper fast html to markdown.
