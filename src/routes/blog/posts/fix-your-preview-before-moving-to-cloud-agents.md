---
title: 'fix your preview, before moving to cloud agents'

description: 'cloud agents can write code while you sleep. very cool. now who is checking if any of it actually works?'

date: '2026-07-03'

lastmod: '2026-07-27'

categories:
  - agents
  - thoughts
  - devops

published: true
---

a few weeks ago i woke up and saw that a cloud agent had opened a PR while i was asleep.

very futuristic.

i also had absolutely no idea if any of it worked.

the summary was confident. the diff looked reasonable. CI was green. all nice things, none of them really answered the question.

so i pulled the branch, ran it, clicked around for a while, then merged it.

this entire futuristic system ended with me becoming the staging environment.

one PR is fine. kind of cute even. but imagine waking up to four of them. now i am pulling branches, rebuilding things, finding test accounts, trying to remember what state the database should be in.

the agent can write code faster than i can decide whether the code is real.

we talk about agents like they remove work. sometimes they just move the work to the least developed part of the system. for a lot of us that part is verification.

CI tells me the code survived CI. useful, but a billing flow can survive CI and still charge the wrong amount. a webhook can pass tests and fail against the provider. then there is staging, usually one shared environment everybody is changing at once. add three agents and the confusion gets automated too.

Ramp's Inspect is interesting because the agent can run against real services, inspect dashboards, and leave evidence before a human reviews the work. Amp's Orbs has the same boring lesson: setup scripts, seeded users, preflight checks, `AGENTS.md`.

the environment has to explain itself.

and preview does not always mean a nice little URL. what is the preview for a database migration? an npm package? a background job? a webhook? sometimes you need a browser. sometimes a disposable database. sometimes logs are the preview.

the preview should look like the thing that can fail.

this is all unglamorous. sandboxes, seeded data, screenshots, logs, isolated environments. but that boring stuff decides whether an agent can check its own work, and whether i can review it without rebuilding the world on my laptop.

which model you use is fun. how many agents you can run is fun. but can someone actually inspect the result without performing a small ritual first?

if the answer is still “deploy to staging and kind of look around,” fix that before adding more cloud agents.

otherwise congratulations, you automated writing code and gave yourself a new full-time job checking whether the code works.

haha.
