---
title: 'agent sdk vs agent server'

description: 'agent sdk vs agent server'

date: '2026-04-01'

lastmod: '2026-04-01'

categories:
  - ai
  - randoms

published: false
---

an sdk is the code you write.
a server is the boundary around it.

inside one process, the agent class and the runtime are basically the same thing.
once it sits behind `AgentServer`, the network starts to matter.

the registry decides where the agent lives.
the transport decides how you reach it.
the client side uses `connect()` instead of importing the class directly.

that is the difference i care about.
not just "can i run it on a server", but "what changes once there are sessions, reconnects, and more than one caller."

```python
from ai_query import AgentRegistry, AgentServer, HTTPTransport, connect
from ai_query.agents import Agent


class WriterAgent(Agent):
    pass

registry = AgentRegistry()
registry.register("writer", WriterAgent)
registry.register("researcher", HTTPTransport("https://api.myapp.com/agents/researcher"))

AgentServer(registry).serve()

agent = connect("https://api.myapp.com/agent/researcher")
```

if the agent stays local, the class mapping is enough.
if it moves, the transport takes over and the call site does not change.

that is why the boundary matters.

the moment a browser can close, a request can drop, or two users can sit on the same session, you are no longer just writing sdk code.
you are handling server work too.

and that is the part people usually underestimate.
it is not just "run it somewhere else."
it is sessions, routing, state, and keeping the same shape when the agent is no longer in your process.
