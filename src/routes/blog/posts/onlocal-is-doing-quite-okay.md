---
title: 'onlocal is doing quite well'

description: "i made h-to-md, a tiny html to markdown converter that is stupid fast and doesn't make you bring a browser to the party."

date: '2026-04-30'

lastmod: '2026-04-30'

categories:
  - tools
  - javascript
  - experiments

published: true
---

A few months ago, I was using alot of ngrok. Was working on something webhooks and stuff, but then probably out of boredom of curiousity maybe, I thought, how does this work?

I was like let me not do any research and think this through my self.

I came up with a theory, it websocket. you open a websock with a remote server and whenver a resource is requested, it goes through the websocket to the local machine, get the stuff, and then the remote server responds. 

was hyped, and got the clanker to create a poc. it worked!

after my POC, (built on DURABLE OBJECTS btw) was only then I got to research how this stuff actually works and should work.

the real stuff is much more fun, but i wanted to keep hacking my websocket thingy.

also watched the interview with the original creator of ngrok - [will update when I find the link]

one problem i had to solve was tunneling websocket connection through a websocket connection.

hmmm, don't recommend.

anyways. [onlocal.dev](https://onlocal.dev) was fun to build and also fun to use.

i really don't want to write technical stuff on this, you can clone the repo, point your clanker at it and you get a better understanding than i could explain to you probably.

here on this blog is for me to express my own process and share the excitement. 

you should also try it out - [onlocal.dev](https://onlocal.dev) 

just run : `bunx onlocal PORT`

add --client "some-string" to get a custom subdomain.


it actually one of my many side quests that actually got a bit of attension and based on the npm numbers (which i don't trust), gaining quite a few downloads weekly.

![onlocal weekly download - npmx.dev ](https://mac-file.yaqeen.me/5505F7E8-0.5.3%20latest.png)
