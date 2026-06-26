---
title: 'Chump: My ai-query Dogfood Project'

description: 'building chump, a coding agent on top of ai-query, to dogfood the framework and create a real feedback loop for improving how stateful ai agents work'

date: '2026-05-8'

lastmod: '2026-05-8'

categories:
  - ai-query
  - agents
  - experiments

published: true
---

A few months ago i built this [framework](https://ai-query.dev) for building AI agents, or stateful AI agents as i like to think about it. but honestly, it was kind of a blind build...

so i decided to build my agents on this framework, so i can have a better and more real world use cases, hence create a strong feedback loop, helping improving the framework.

built a couple of agents on it.. i think i talked abit about [profile.ai-query.dev](https://profile.ai-query.dev), which is just a social media kinda tool to search about a person.. building that actually came with a lot of improvement to the framework which i really appreciated.

then couple more projects, but those were simple, i didn't actually spend much time with the thing, i diverged to obviusly follow some other shiny stuff.

With the rise of [Pi Agent](https://pi.dev) (Amazing stuff, got to learn about it abit earlier than the hype, dope stuff) naturally coding agents/harness, is the new shiny stuff, and i get attracted to new shiny stuff hence, followed it.

Why not build something too, i said, and that too on top of ai-query. NICE! (i smirked actually)

that how [chump agent](https://github.com/Abdulmumin1/chump) came to be, a lil coding agent, built on top of [ai-query](https://ai-query.dev).

but ai-query is a python framework, which don't do well when you build out their binaries.. so i ended up with the client/server split..

chump, like most harnesses out there has a client/server architecture.. python with ai-query, and then typescript with some custom tui implementation.

<span data-highlight>after the original scaffold, i actually continued building chump with chump.</span> i don't know, it was like really fun to watch.

then, came another idea: ai-query is built for realtime collaborative agents, why do i just have a tui?

well, the web was born as well. at the time of writing this, it still ongoing work, and has not been deployed yet.

and it was fairly one of the easiest stuff i've done. ai-query already takes care of all of the hard work, the web was just another client like the tui.

<span data-highlight>and the fun part is that, you can have multiple tuis and web clients connected to same session. changes syncs across in realtime and stuff.</span>

i do have a video you might be interested in taking a look at:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">i think a me vid shows the enthusiasm better :) <a href="https://t.co/CY2cIzqQn9">https://t.co/CY2cIzqQn9</a> <a href="https://t.co/yyXze3oglA">pic.twitter.com/yyXze3oglA</a></p>&mdash; yaqeen (@abdulmuminyqn) <a href="https://twitter.com/abdulmuminyqn/status/2052686775047336156?ref_src=twsrc%5Etfw">May 8, 2026</a></blockquote>

also would be cool if you checkout the repo: [Abdulmumin1/chump](https://github.com/Abdulmumin1/chump)
