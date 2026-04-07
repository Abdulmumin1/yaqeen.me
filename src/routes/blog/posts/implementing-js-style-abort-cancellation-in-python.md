---
title: 'implementing js style abort cancellation in python - ai-query'

description: 'python does not ship the exact same thing by default, but i keep wanting the same idea anyway for ai-query.dev'

date: '2026-02-14'

lastmod: '2026-02-14'

categories:
  - python
  - ai
  - randoms

published: true
---

js has `AbortController` and `AbortSignal`.

python does not ship the exact same thing by default, but i keep wanting the same idea anyway for ai-query.dev

the point is simple.

since ai-query is following the primitives of ai-sdk, i try to make the apis look as close as possible, and abortsignal is a good overall dx

that the point of ai-query, crazy good dx, not sure i archieved that yet :/ but we're getting somewhere.

so here is the implementation details:

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

that feels more like js.
and it works

![abort signal docs ai-query.dev](https://pbs.twimg.com/media/G-3HB0dWwAAEXCs?format=jpg&name=4096x4096)

Checkout [ai-query](https://ai-query.dev)
Star on Github [ai-query github](https://github.com/abdulmumin1/ai-query)
