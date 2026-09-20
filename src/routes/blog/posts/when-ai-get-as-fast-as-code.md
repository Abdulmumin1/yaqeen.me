---
title: 'When AI Gets as Fast as Code'
description: 'Why treating models as chatty text generators limited software architecture, and what happens when aligned decision models turn semantic judgment into a fast runtime primitive.'
date: '2026-09-20'
lastmod: '2026-09-20'
categories:
  - ai
  - engineering
  - architecture
published: true
---

Imagine a world where AI models like [Jev](https://typesafe.ai) get as fast as code... Yeah, sounds impossible, but we're humans, remember! Computers were not even supposed to exist, but they did. They're not supposed to be this small, but they are. We're not supposed to have 3nm chips, but we do!

We literally tricked rocks into thinking by putting lightning through sand. So saying a model can never be as fast as an `if` statement is just ignoring everything we've done for the last eighty years.

Right now, we have a hard boundary in software.

If you need a decision made in sub-millisecond time, you write hardcoded `if/else` checks, regexes, or finite state machines. They're fast, but they're brittle (at least since we've been figuring out how to replace them with AI). They can't understand intent, nuance, or context.

If you want actual judgment, understanding what a user is trying to do, whether a code diff introduces subtle risk, or which tactical move makes sense, you reach for an LLM.

Because of that 500ms tax, nobody in their right mind puts a model inside a tight `for` loop, or in a Git hook, or inside a database query. It's just way too slow, costs too much, and is unpredictable.

## Making Logical Decisions Over Choices

A model like [Jev](https://typesafe.ai) isn't trying to be a text generator. It's built specifically to evaluate state, weigh tradeoffs, and make logical decisions given a set of choices.

When a model doesn't need to generate conversational prose, its entire compute goes directly into evaluation:

* Given this game state and these four possible moves, which one cuts off the opponent's escape?
* Given this npm install script, is this behavior benign setup or an attempt at credential exfiltration?
* Given this screen state and a user goal, which DOM element is the logical next step to interact with?

Because the model is evaluating probabilities across candidate choices directly rather than generating text, the latency drops from seconds down to ~70ms. And eventually, into single-digit milliseconds.

## Applications I See Today Already

### Airbags for agents (actual runtime alignment)

Giving an LLM free rein over bash or database tools is scary. But asking the same LLM *"is this safe to run?"* doesn't work. It has total bias for its own plan.

Putting a fast, dedicated decision model in front of every tool call changes the game. Before any destructive command executes, it evaluates the action against safety choices in milliseconds. It doesn't talk or rationalize; it just acts like an OS-level permission gate.

### Discrete search & games

Think about games like tic-tac-toe, chess, or state-space pathfinding. Traditionally, you write hand-tuned heuristics because calculating deep minimax trees is too expensive.

When you can evaluate candidate moves with a fast model, you don't need text generation. You feed the board state and the legal moves into a choice matrix. Minimax can now explore deep trees where every branch is evaluated by actual strategic intuition in near-zero time.

### Replacing Ctrl+F and regex

`Ctrl+F` and `grep` are 50 years old and only understand literal characters. Vector search (RAG) is heavy and requires chunking and databases.

With fast classification, you can stream raw text directly through semantic filters in real time. You search *"show me errors that are NOT network timeouts"* and the editor highlights them instantly as you type.

### Adaptive UI controls

Instead of burying 50 buttons in nested menus or writing complex state machines to predict what the user wants next, the interface evaluates context on the fly and surfaces the top 3 most logical actions right when you need them.

## We Might Be Onto Something, Really!

As decision models get faster, the way we design systems changes:

1. **Heavy models plan, fast models act:** Frontier LLMs handle long-horizon reasoning and architecture, while fast decision models handle real-time execution, verification, and reflex loops.
2. **Semantic branching becomes standard logic:** Instead of writing brittle regexes or fragile heuristics to handle edge cases, you define choice spaces and let an aligned decision model pick the path.

We are still in the early stages of this shift. Right now it runs in dozens of milliseconds over an API. But as these decision weights get compiled closer to the metal and run on local silicon, the boundary between deterministic code and semantic judgment will disappear entirely.
