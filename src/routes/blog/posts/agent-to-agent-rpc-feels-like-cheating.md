---
title: 'agent to agent rpc in ai-query'

description: 'agent to agent rpc in ai-query'

date: '2026-03-31'

lastmod: '2026-04-01'

categories:
  - ai
  - python
  - randoms

published: true
---

I think RPC provides for a really good dx, and it a thing i've been trying to get working for my agent framework.

the RPC part is not just one agent sending text to another.

in ai-query, the part that matters is the registry and the transport layer.
that is what keeps agent logic separate from infrastructure.

the registry answers a simple question: where does this agent live?
local, remote, same process, another server.
the code should not really care.

```python
from ai_query import AgentServer, AgentRegistry, HTTPTransport
from ai_query.agents import Agent, action


class SupportAgent(Agent):
    @action
    async def resolve(self, ticket_id: int, reason: str):
        return {"ticket_id": ticket_id, "status": "resolved", "reason": reason}


class ManagerAgent(Agent):
    async def escalate(self, ticket_id: int):
        support = self.call("support-agent-1", agent_cls=SupportAgent)
        return await support.resolve(
            ticket_id=ticket_id,
            reason="escalated by manager"
        )


registry = AgentRegistry()
registry.register("manager", ManagerAgent)
registry.register(
    "support-agent-1",
    HTTPTransport("https://api.myapp.com/agents/support")
)

AgentServer(registry).serve()
```

the same manager code still works if support is local.
you just map `"support-agent-1"` to `SupportAgent` instead of an `HTTPTransport`.

that is the whole point.

`@action` makes a method callable.
`self.call()` gives you a typed proxy to another agent.
the transport decides whether the call stays in process or goes over http.

if you are outside an agent, you do not use `self.call()`.
you use `connect()`.

```python
from ai_query import connect

agent = connect("https://api.myapp.com/agent/researcher")
result = await agent.call().analyze_data(limit=10)
```

there is also per-connection state.
that matters when more than one user is talking to the same agent.

store data in `connection.state` inside `on_connect`, then read it from `self.context.connection.state` inside the action.

```python
from ai_query.agents import Agent, Connection, ConnectionContext, action


class ChatRoom(Agent):
    async def on_connect(self, connection: Connection, ctx: ConnectionContext):
        connection.state["user_id"] = ctx.metadata.get("user_id", "anonymous")

    @action
    async def who_am_i(self) -> str:
        return self.context.connection.state.get("user_id", "unknown")
```

that stops callers from stepping on each other.
which is the real problem, most of the time.

rpc is not flashy.
it just keeps the system readable once the agents stop living in the same place.if 

and when you are building agents, that is already a good result.
