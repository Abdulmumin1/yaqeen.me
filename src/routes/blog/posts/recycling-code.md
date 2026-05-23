---
title: 'recycling code'

description: "dksdfm"

date: '2026-05-8'

lastmod: '2026-05-8'

categories:
 - ai-query
 - agents
 - experiments
 
published: true
---

i've built quite a few interesting stuff, most of them i want them or just to learn. but what is really cool is that i get to use most of what i build in other stuff i build (i feel good everytime i do this).

one product i use often is littlestats.click, which is a analytics tool i built prolly around 2024/25 which i use in all things website i do.

And of course since i don't have much success with stuff i built, using it myself, has kinda given me feedback to improve whatever it is i built.

one big recent examples are. [ai-query.dev](https://ai-query.dev) and [onlocal.dev](https://onlocal.dev), but of this projects i'm using it to build a coding agent called [chump](https://github.com/abdulmumin1/chump)... and i would say, none of my dogfooding has even create a strong feedback loop as this.

i built ai-query to build stateful agents, but i mentioned in a prev blog post, it was a blind build, i have no one trying to break it or doing dump stuff, so must issues users would run into, i never catch them in my test or little examples..

but when i started building chump, a ton of bugs, feature gaps starts to surface, hence i was working on both codebases in parallel, once i run it some issue in chump agent, dig and see it an issue from ai query, switch back to the codebase, fix it and comeback to working on chump.. which i don't know makes me feel excited about building this stuff, even though i'm my only customer.

another instance was with onlocal.dev, so in chump agent, you can connect to your chump instance running remotely, via cli or web interface. i wanted a tunnel solution backed in, so that if you're in a chump instance, you can instantly create a live endpoint, and use that to connect via the web... i brought in onlocal.dev, but but it had issues which one of it is. it also suffers from compressions like most solutions.

ai-query realtime is obviosuly built around SSE and websocket, having onlocal.dev which at the time, not that it does not support sse, but it randomly drop packets.. websocket passthrough is also not working properlly. 

This resulted in a fix, i think it was the most exciting one for me soo far, because onlocal.dev is one of my tools that has a bit of adoption, so having catch this issues before anyone else was a ton of joy to hold.

well, thanks for reading my yap.

(yes the writing is not polished, but this is me just writing without properly thinking it through)
