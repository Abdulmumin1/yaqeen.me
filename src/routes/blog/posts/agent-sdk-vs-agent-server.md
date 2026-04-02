---
title: 'crossing the sdk and server boundary in ai-query'

description: 'crossing the sdk and server boundary in ai-query'

date: '2026-04-01'

lastmod: '2026-04-02'

categories:
  - ai
  - randoms

published: false
---

the part i wanted to show is not just the sdk or the server.
it is that the same agent code can move across that boundary without changing how i use it.

`AgentRegistry` decides whether an id maps to a local python class or an `HTTPTransport`.
`AgentServer` serves that registry.
`connect()` is what you use from outside the agent process.

```python
from ai_query import AgentRegistry, AgentServer, HTTPTransport
from ai_query.agents import Agent, action


class WriterAgent(Agent):
    @action
    async def draft(self, prompt: str):
        return {"text": prompt.strip()}


registry = AgentRegistry()
registry.register("writer", WriterAgent)
registry.register("researcher", HTTPTransport("https://api.myapp.com/agent/researcher"))

AgentServer(registry).serve()
```

```python
from ai_query import connect

client = connect("https://api.myapp.com/agent/writer")
result = await client.call().draft(prompt="write a short note")
```

if the agent stays local, the class mapping is enough.
if it moves, the transport takes over.

that is the point.
the call site does not have to care where the agent lives.

once you have sessions, reconnects, and more than one caller, that separation stops being theory.
it becomes the difference between a small sdk demo and something you can actually run.

that is what i wanted to show with ai-query.
