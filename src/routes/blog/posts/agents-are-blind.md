---
title: 'Agents are blind'

description: "like if you don’t really understand how a feature should behave, how state should transition, what should never happen… the agent will decide that for you."

date: '2026-04-21'

lastmod: '2026-04-21'

categories:
  - thoughts
  - agents
  - clanker

published: true
---

so i’ve been clanking out a lot more code lately. like way more than usual. work, personal stuff, experiments… just shipping.

and there’s a gotcha to this "software is largely solved" issue and that is:

these clankers are blind.

not in a “they’re dumb” way, far from it. they’re actually too capable. they’ll generate whatever you ask, fill gaps, make things “work”.

but that’s the problem.

they don’t see your system. they don’t see constraints, intent, or boundaries. they just… assume.

<span data-highlight>like if you don’t really understand how a feature should behave, how state should transition, what should never happen… the agent will assume and decide for you.</span>

it’ll write the code, write tests, everything passes. you run it, looks good. you ship.

done right?

not really.

<span data-highlight>what you shipped is just a collection of assumptions that *happened* to pass.</span>

and this piles up. slowly. system starts to feel brittle. not because the code is bad, but because the behavior was never fully thought through.

every assumption you skipped, the agent filled in.

ran into this recently in owostack.

we have this feature for overriding usage. say a user has 40 credits/week, you can bump them to 100 as a reward or something.

i let the agent handle it. code came out, tests passed, i checked it quickly. it worked. pushed to prod in like 3 hours.

later i decided to actually look at it properly.

two issues.

first, all credit usage, whether from the plan or the override, was being treated the same for invoicing. which means over charging on what should be free grant.

second, when the override was removed, the system “restored” credits. but what it actually did was refill the entire balance, even if the user had already used some before the override existed.

nothing broke. no errors. everything “worked”.

just wrong.

and that’s the thing.

<span data-highlight>agents don’t know what’s *right* for your system. they don’t know your invariants. they don’t know what should never happen.</span>

you do. or at least you should.

or at least you should be questioning this assumptions. sometimes it’s code doing exactly what it was told… just not what you meant.

so yeah.

agents are powerful.

but they’re blind.

question is… are you?

![A players have A agents, B players have C agents](https://mac-file.yaqeen.me/2856CCC7-Thorsten%20Ball.png)
