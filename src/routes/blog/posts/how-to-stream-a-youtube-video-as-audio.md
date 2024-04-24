---
title: 'How to stream a YouTube video as audio - Introducing Liseen'

description: 'Liseen helps you to listen to youtube videos as audio, it a really cool solution and a small effort to fix your focus, while enjoying your favorite content that is only available on YouTube.'

date: '2024-05-14'

lastmod: '2024-05-14'

categories:
  - product launch

  - liseen

  - micro tools

label: 'product launch'

published: true
---

I absolutely enjoys YouTube honestly, and I'm not very disciplined when I'm in. This is something that I really want to minimize.

In the quest of a solution, I thought it would be cool if I could listen to some of my favorite creators whose visuals does not add much to the value I'm getting from their videos while I’m working, like Ali Abdaal, religious lectures, history vids and my favorite nasheeds and so forth.

That's how **Liseen** came to live, it a really cool solution and a small effort to fix your focus, while enjoying your favorite content that is only available on YouTube.

I put quite an effort to make it more fun to use, with a really clean UI and subtle animation touches.

If you're curious to how I was able to pull audio out of a YouTube videos, then read further! Otherwise, start listening already 🎧. [liseen](https://liseen.vercel.app)

## How it works.

When I was tinkering the way it would work Initially, I thought I would fetch the raw video stream, do some magic and extract the audio from the stream. Sounds really complicated, but I was willing to pull it off. Until I encountered my oversight, YouTube does not give you direct access to a video steam, and just like that, t that entire plan met it end.

But, somehow I still need to make it work, Then another solution hit my brain, which spoiler alert ⚠, it worked and that is how the content is currently being played on **Liseen**.

I used Iframe embedding instead, but make the size Non existence, that is, 0 width and height. This solution while might look like scam, it actually get the job done, while also delivering on one of the promises I.e low data consumption, as most playback are set to the most minimum quality where audio quality is not sacrificed.

This effectively concludes how **Liseen** plays a YouTube video as audio for other methods of fetching video information (title, description and thumbnail ) the YouTube API is used for this purpose.

## Playing in background.

This one is very tricky to make, and honestly, I have no control over whether or not, the content playing will keep in the background. The way I've implemented it is to play the content whenever it is paused due to sleep or the window is minimized.

This method comes with some side effects and features like “kill background apps consuming power” on mobile devices might make this unreliable, “but so far In my tests I never ran into such problem".

**Liseen** can also be installed as a **PWA**, which makes accessing it a lot easier.

## Your thoughts?

Super had fun building this, especially that I have to hack a lot things to make it work. I've been using it ever since, it has helped me a lot in avoiding getting distracted by YouTube, when I’m working.

Love to know what you think, is it cool 😎 or just meh. BTW if you have a better way to implement, I'm willing to listen to you 😉.

**Stay super awesome 😊.**
