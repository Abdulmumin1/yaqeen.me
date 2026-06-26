---
title: 'Playing with Python tinyrpc'

description: "Building an async RPC system in Python using a queue-based architecture — clients fire requests without waiting, and results are delivered when processing completes."

date: '2025-09-11'

lastmod: '2025-09-11'

categories:
  - RPC

published: true
---

Following the read on capnweb, i decided to implement something cool with tinyrpc from a decade ago in python (nostalgia)

Which is just a queueing system that takes an input and process it. the client does not wait for response. once the processing is done, notifies the client.

![tinyrpc implemt](https://pbs.twimg.com/media/G5bkRVXXUAEl5HP?format=jpg&name=4096x4096)
