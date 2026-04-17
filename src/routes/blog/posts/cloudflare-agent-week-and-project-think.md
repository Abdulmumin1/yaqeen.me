---
title: 'Building a docs QA agent on project think'

description: "so cloudflare just had their agent week, bunch of new drops and all, but i'm limited so i can only try out those that really did fire some neurons in my brain."

date: '2026-04-17'

lastmod: '2026-04-17'

categories:
  - cf
  - Durable Objects
  - experiments

published: true
---

so cloudflare just had their agent week, bunch of new drops and all, but i'm limited so i can only try out those that really did fire some neurons in my brain.

one of which is [Project Think](https://blog.cloudflare.com/project-think/), this is a lil harness, built ontop of Durable Object (like every other thing they've built soo far). 

the timing also line up with a lil experiment i was doing w/ [agentOs](https://www.rivet.dev/agent-os) by rivet, which was a docs search agent.

as we know RAG IS DEAD (i dunno, people just say it and i went with it), and i've tried such systems that uses the RAG method, they didn't quite do well for owostack docs.

since we're at the age of harnesses, why not create an agent that can triage the raw docs md file and maybe the codebase and answer questions about your docs directly from the source files?

simple right?

yes, but cloning a repo, keeping it up to date and also warm before any query land i know is job of Durable Objects..

hence the excitement about Project Think, i could use that, coupled with [cloudflare/shell](https://github.com/cloudflare/agents/tree/main/packages/shell) for virtual filesystem and workers ai to create something anyone with a cloudflare acccount could deploy in minutes. and have a usable endpoint to query thier docs. even if they don't have docs, it could still use their codebase as a source of truth.


and that what I did - i call it [cull](https://github.com/Abdulmumin1/cull)


Another i was excited for is Artifacts.

Currently the system works by cloning the repo into a single Durable Object, meaning that we route all requests to that single object.

If we move repo state out of that single answering DO and into Artifacts, then we can split the system into:

- repo storage layer: Artifact
- sync/update path: one job or one control DO
- query hot path: many DOs or even stateless worker requests reading the same repo snapshot/mount

That would let us use multiple DOs because the repo would no longer “live inside” one DO-local Workspace.

soo basically we have a concurrency problem, and obviously there are ways to solve this, but the point of this is to show you why i was excited about Artifacts.

But Artifacts are in private beta, so hmmm, i will have to solve this my way.

anyways. 

Hope you enjoyed the Agents Week ;)
