---
title: 'fix your preview, before moving to cloud agents'

description: 'cloud agents are becoming remote workers with their own machine. if your preview and validation loop is still weak, more agent throughput will mostly turn into more uncertain PRs.'

date: '2026-07-03'

lastmod: '2026-07-03'

categories:
  - agents
  - thoughts
  - devops

published: true
---

a few weeks ago i woke up, checked my phone, and saw a notification. a cloud agent had opened a PR while i was asleep, and i had absolutely no idea whether any of it actually worked.

i stared at the diff for a while. i read the summary, everything looked fine, in that specific way where nothing is wrong and you still do not trust it.

i pulled the branch. it ran. i clicked around. the thing did what the description said it would. i merged it.

and then i sat there thinking about what happens when this is not one PR but four. one agent opening a few PRs a week, i can keep up. three agents running overnight in parallel, waking up to multiple PRs touching overlapping parts of the system, each with a confident summary and green checks. at that point the time i spend pulling branches and clicking around starts to add up. the bottleneck shifts from whether the agent can write code to whether i can actually verify what it wrote before i merge.

a ton of teams i talk to do not have a good answer to this yet. the default workflow is still: read the diff, check if CI passed, deploy to a shared staging environment, then fixes and clean ups happens in the staging enviroment. With agents numbers goes up. more PRs, more throughput, more things changing while nobody is looking. you will surely lose track quickly when changes are not isolated well enough to verify as a whole. the fix, and the supporting changes it depends on, should usually land in the same PR. otherwise suddenly hope is doing a lot of the work :) this is expecially true for teams without proper product management pipeline.

Ramp wrote about their internal tool, Inspect, which lets the agent run against real services, inspect dashboards, verify frontend changes, and produce evidence that the thing works before a human looks at it. the tool is interesting, and what stood out was the decision behind it: they treated the agent's output as something that needed to be verified against a live system, not something you accept because the diff looks clean.

Amp's notes on Orbs point in a similar direction. they spend a lot of words on setup scripts, resume scripts, AGENTS.md files, seeded users, preflight checks, the kind of stuff that makes a repo legible to a machine that just landed in it. when you read their writeup, the emphasis lands on making the environment explain itself rather than on making the agent smarter.

and then there is the preview part. i do not mean every branch gets a neat URL and the problem disappears. previewing a web page change is one level of difficulty. previewing a database migration, a billing flow, a background job, an npm package change, or a webhook integration is a different thing entirely. some work needs seeded data. some needs mock external services. some needs a disposable database. some needs logs and traces more than a browser tab.

the messy cases are the ones that matter most. if a change is hard to preview when one human opens a PR, it gets harder when agents start opening several of them in parallel. the preview layer has to be honest about the kind of change it is showing you. sometimes the preview is a URL. sometimes it is a test app consuming a package build. sometimes it is a temporary environment with seeded data and mocked providers. sometimes it is a reproducible artifact with enough logs to review the behavior.

repo instructions. setup scripts. sandboxes. preview links. logs, screenshots, artifacts. unglamorous infrastructure determines whether an agent can verify a change before opening a PR, and whether you can review that change as a whole once it gets to you.

the focus right now is on the agent: the harness, which model, how many can run at once, whether it works from Slack, whether it has a dashboard. that stuff is fun. i get it. but a more useful question is: for each kind of change your repo produces, what would it take to inspect it without rebuilding the whole world by hand?

if the answer is still "we deploy to staging and kind of look around," i would fix that before moving harder into cloud agents.

otherwise, haha.
