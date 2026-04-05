---
title: 'crossing the agent sdk vs server boundary in ai-query'

description: 'what it feels like to cross the sdk and server boundary in ai-query'

date: '2026-02-05'

lastmod: '2026-02-05'

categories:
  - ai
  - randoms

published: true
---

the part i wanted to show is not just the sdk or the server.

it is that the same agent code can move across that boundary without changing how i use it.
that sounds small until you actually do it.

once the code stops living in one process, a bunch of boring things show up.
registry. transport. sessions. reconnects. more than one caller.
none of that is flashy, but that is the real work.

`AgentRegistry` is the piece that makes the split not annoying.
it answers one question: where does this agent live?
if it is local, map the id to a python class.
if it is remote, map the same id to an `HTTPTransport`.
the rest of the code should not need a different shape just because the agent moved.

`AgentServer` serves that registry.
`connect()` is what i use from outside the agent process.
so i can keep the same mental model whether i am calling a local class, an http endpoint, or something that will end up on another machine later.

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

agent = connect("https://api.myapp.com/agent/writer")
result = await agent.call().draft(prompt="write a short note")
```

that is the thing i like here.
the code that uses the agent does not need to know if the agent is local or remote.
the call site stays the same and the transport gets to be boring in the background.

i think people sometimes talk about sdk and server like they are two different products.
in practice they are just two halves of the same boundary.
if you never cross it, the distinction does not matter much.
if you do cross it, the distinction is the whole point.

the other part that made this feel real to me is caller state.
once there is more than one user, or one browser tab, or one reconnect, you stop being able to pretend there is only one conversation.
that is where `connection.state` and `self.context.connection.state` matter.
it is not glamorous, it just stops callers from stepping on each other.

the same idea shows up inside agents too with `self.call()`, but that is another rabbit hole.
for this post i mostly care about the boundary itself, because that is where the cool part of ai-query is.

and yeah, that is mostly what i wanted to show with ai-query.
not a big comparison post.
just the small thing that becomes a real thing when the agent stops living next to your code.
