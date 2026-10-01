---
title: 'switching models doesn''t burst your prompt cache'
description: "the claim that switching models mid-task instantly invalidates your prompt cache is wrong. caches are per-model namespaces, so switching forks the cache instead of bursting it. here's the mechanics, a test you can run, and the confounders that make people believe the myth"

date: '2026-09-26'

lastmod: '2026-09-26'

categories:
  - ai
  - randoms

published: false
---

you've probably heard some version of this: "never switch models mid-task, you'll instantly nuke your prompt cache." it shows up in every harness discussion and it sounds plausible. it's also wrong. but it's wrong in an interesting way, because there's a real cost hiding underneath it that people keep misattributing.

## what the cache actually is

when a model processes a prompt, it computes key-value (KV) states for every token — the intermediate tensors the model uses to refer back to earlier tokens while generating. prompt caching saves those tensors for a prefix of your prompt, so the next request that starts with the same bytes skips recomputing them.

the openai docs are blunt about it: "The prompt cache stores key-value (KV) tensors, not the tokens themselves."

<span data-highlight>the whole game is exact prefix match from token 0. if the first k tokens of a request are identical to a previous request, you reuse everything up to k. if token 5,000 changed, tokens 0–4,999 are still cheap and everything from 5,000 on gets recomputed.</span>

anthropic's docs describe the lookup the same way: the system computes the prefix hash at your cache breakpoint, and if there's no entry there, it walks backward through earlier positions looking for an entry that a previous request wrote. writes happen at breakpoints, reads walk back. ttl is 5 minutes by default, refreshed every time the entry is used.

## the part everyone skips: the cache key includes the model

here's the fact that kills the myth: a cache entry is only valid for the model that computed it.

a KV tensor is a function of the model's weights. sonnet's attention states are gibberish to haiku — there is no scenario where one model reuses another model's precomputed states. the model id is part of what makes an entry usable, and openai's docs say it directly: "A different model can use different weights and caching behavior."

so "the prompt cache" isn't one big pool. it's one namespace per model, per organization, per prefix lineage. every model that has ever appeared in your conversation has its own stack of entries, growing independently.

<span data-highlight>and that's why the myth can't even be mechanically true: switching to model B cannot delete model A's entries, because model B's requests never touch model A's namespace. there's no mechanism for it. it's not policy, it's math.</span>

## the test

this claim is falsifiable with a few curls. run three turns against model A, one turn against model B, then a fourth turn against model A — all inside the 5 minute ttl. watch the usage fields:

| request                | cache_creation_input_tokens | cache_read_input_tokens     |
| ---------------------- | --------------------------- | --------------------------- |
| A, turns 1–3           | new tokens each hop (1.25x) | grows each hop (0.1x)       |
| B, cold                | ~everything                 | 0                           |
| A, after the detour    | ~nothing new                | ~everything (0.1x)          |

that last row is the entire argument. if switching "burst" the cache, A's request after the detour would read zero tokens from cache. instead it reads the whole conversation at 0.1x, because A's namespace was never touched. (on openai the fields are `input_tokens_details.cached_tokens` and `cache_write_tokens` — same idea, and their ttl is 30 minutes on the newer models.)

## so why does everyone believe it

because right after a switch, one of two things happens, and both look exactly like a cache burst:

**the spike.** B's first request has a cold namespace. it prefills the entire conversation at full price (1.25x cache-write on anthropic) and time-to-first-token tanks because there's nothing to reuse. cost monitors see the spike right after the `/model` command and the story writes itself. nothing died — a new namespace was born, and births are expensive.

**the harness really does mutate the prompt.** plenty of harnesses inject model-specific system prompts, tweak tool lists per model, or add context on switch. if that change lands early in the serialized prompt — remember, `tools` → `system` → `messages`, in that order — then yes, everything downstream is dead on the next request, for every model. that's real. but it's harness behavior, not a property of switching models. the conversation history doesn't change when you `/model`; if the harness rewrites the prefix at the same time, that's the thing to complain about.

a few more confounders worth separating:

- **idle time.** anthropic's ttl is 5 minutes, refreshed on use — and measured from the start of the request that wrote or read the entry, so a 4-minute generation eats most of the window. spend eight minutes on B and A's cache is gone. that's not the switch, that's the clock.
- **provider split.** the same model via bedrock vs the first-party api is a different cache. openai's docs note caches aren't shared across organizations or regional boundaries. switching providers looks like switching models from the cache's point of view.
- **compaction.** the moment the harness summarizes old turns, the prefix diverges mid-conversation and everything after the summary gets recomputed. this one's unavoidable and probably deserves its own post.

## the kernel of truth

here's what's actually true: every switch to a model that hasn't seen the conversation costs one cold request — full prefill, 1.25x write on anthropic, slow first token. a one-turn cameo from a new model never amortizes that.

so the practical rule isn't "never switch." it's:

- batch work per model: all the opus thinking, then all the sonnet execution
- don't ping-pong every turn — each hop pays a fresh write premium
- coming back to A inside the ttl window is nearly free
- keep anything volatile (timestamps, per-request state) out of `tools` and `system`, or the cache dies for real, for everyone

## tl;dr

<span data-highlight>switching models doesn't burst your cache. it forks it. the model you left keeps its entries until ttl expires — and gets refreshed every time you hit it. the model you switch to starts cold and pays one write.</span> the real cache killers are the ones nobody blames: idling past the ttl, rewriting the prompt early, compaction, and touching `tools` or `system`.
