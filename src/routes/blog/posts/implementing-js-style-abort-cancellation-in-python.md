---
title: 'implementing js style abort cancellation in python'

description: 'implementing js style abort cancellation in python'

date: '2026-01-01'

lastmod: '2026-01-01'

categories:
  - python
  - ai
  - randoms

published: true
---

js has `AbortController` and `AbortSignal`.

python does not ship the exact same thing by default, but i keep wanting the same idea anyway.

the point is simple.

if a task is no longer wanted, it should stop cleanly.
not after it finishes.
not after it keeps burning time.
just stop.

that matters a lot once you have long running work.
downloads, streams, agents, background jobs.
anything that can keep going after the user already moved on.

```python
import asyncio


class AbortError(Exception):
    pass


class AbortSignal:
    def __init__(self):
        self.aborted = False
        self.reason = None

    def throw_if_aborted(self):
        if self.aborted:
            raise AbortError(self.reason or "aborted")


class AbortController:
    def __init__(self):
        self.signal = AbortSignal()

    def abort(self, reason=None):
        self.signal.aborted = True
        self.signal.reason = reason
```

then the work just checks the signal while it runs.

```python
async def fetch_chunks(signal):
    for chunk in range(10):
        signal.throw_if_aborted()
        await asyncio.sleep(0.2)
        print(chunk)
```

it is boring code.
that is the point.

i do not want every function to invent its own cancel flag.
i do not want each layer to guess what to do when the user is gone.
i want one signal that can move through the whole call stack.

that feels more like js.
and it works better than pretending cancellation is some edge case.
it is not an edge case.
it is normal.
