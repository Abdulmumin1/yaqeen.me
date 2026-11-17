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

Suppose models like [Jev](https://typesafe.ai) get as fast as code. That sounds impossible. Computers weren't supposed to exist either. They weren't supposed to get this small. We weren't supposed to have 3nm chips.

We tricked rocks into thinking by running lightning through sand. Saying a model can never be as fast as an `if` statement ignores eighty years of that.

## The boundary

Software has a hard line right now.

Need a decision in under a millisecond? You write `if/else`, a regex, or a state machine. They're fast and brittle. They can't read intent, nuance or context.

Need judgment? What is the user trying to do, does this diff add subtle risk, which move makes sense? You call an LLM.

That costs about 500ms, so nobody puts a model in a tight `for` loop, a Git hook or a database query. It's too slow, too expensive and too unpredictable.

## Decisions, not prose

A model like Jev doesn't try to write text. It evaluates state, weighs tradeoffs and picks from a set of choices.

With no conversational prose to produce, all the compute goes to evaluation:

* Given this game state and four possible moves, which one cuts off the opponent's escape?
* Given this npm install script, is this benign setup or credential exfiltration?
* Given this screen and a user goal, which DOM element is the next step?

The model scores the candidate choices directly instead of generating text. Latency drops from seconds to about 70ms, and eventually to single-digit milliseconds.

## What this already does

### Airbags for agents

Giving an LLM free rein over bash or database tools is scary. Asking the same LLM "is this safe to run?" doesn't work, because it's biased toward its own plan.

Put a fast decision model in front of every tool call. Before a destructive command runs, it checks the action against safety choices in milliseconds. It doesn't talk or rationalize. It works like an OS permission gate.

### Games and search

Tic-tac-toe, chess and pathfinding usually run on hand-tuned heuristics, because deep minimax trees are too expensive to compute.

With a fast model you skip text. Feed in the board and the legal moves as a set of choices. Minimax can search deep, and every branch is judged by something like strategic intuition at almost no cost.

### Replacing Ctrl+F and regex

`Ctrl+F` and `grep` are fifty years old and only understand literal characters. Vector search needs chunking and a database.

Fast classification lets you stream raw text through a semantic filter. Search "show me errors that are NOT network timeouts" and the editor highlights them as you type.

### Adaptive UI

Don't bury 50 buttons in nested menus, and don't hand-write a state machine to guess what the user wants. Read the context and show the three most likely actions when they're needed.

## What changes

1. **Heavy models plan, fast models act.** Frontier LLMs do long-horizon reasoning and architecture. Fast decision models do real-time execution, verification and reflex loops.
2. **Semantic branching becomes normal logic.** Skip the regex and the fragile heuristic. Define the choices and let an aligned decision model pick.

It's early. Today this runs in dozens of milliseconds over an API. Once the weights are compiled closer to the metal and run on local silicon, the line between deterministic code and semantic judgment goes away.
