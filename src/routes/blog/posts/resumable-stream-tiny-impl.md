---
title: "Resumable Agent Streams with Redis"

description: 'Resumable Agent Streams with Redis'

date: '2025-09-16'

lastmod: '2025-09-16'

categories:
  - redis
  - agents

published: true
---

I was working on an agent that notorioulsy takes a while to complete. It was originally designed to be a simple request + a response stream. but that was too simple i guess.. that it breaks all the time, and it not really kinda headless. meaning a browser client need to be always connected for the stream to clank out anything. Then realized, i could just use Redis Stream for this instead.. 

The flow is "elegantly" simple: a client triggers an event, a background worker handles the heavy lifting, and every single log is appended to a Redis Stream as the source of truth. Instead of a standard one-way socket, a dedicated playback endpoint reads the entire history and then switches to "tailing" mode for new events.

By passing a last_log_id in the request, the client can reconnect after a network blip and resume the stream precisely where it broke. This creates a stateless, bulletproof UI that keeps the Agent's "train of thought" visible, no matter what happens to the connection.

it was quite fun to implt and genuilly happy with how it turned out + did this without any help from AI (pretty something to brag about :} )
