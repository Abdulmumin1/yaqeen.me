---
title: 'Billing engines are a mess'

description: 'A short note on why billing logic gets ugly much faster than most teams expect.'

date: '2026-03-27'

lastmod: '2026-03-27'

categories:
  - billing
  - saas
  - architecture

published: true
---

I was reading Lago's piece on why billing systems are a nightmare for engineers, and it lines up with something I have been feeling for a while now: billing engines are a mess, and they get messy much earlier than people think.

The thing about billing is, from the outside it always feels like a tiny feature. a plan has a price, a customer subscribes, invoice gets generated, money enters account. very cute.

but once you start thinking a little longer than that, it already begins to rot.

dates alone are enough to make you tired. leap years, trial periods, monthly vs yearly, anniversary billing vs calendar billing, pro-rating, mid-cycle upgrades, downgrades, and when exactly usage should reset. one of those things where every answer sounds obvious until the first customer support ticket lands.

then comes usage-based billing and the whole thing becomes even more annoying. because now you're not just charging for a plan anymore, you're counting events, aggregating them, deduplicating them, deciding what timeframe matters, replaying them safely, and somehow trying not to charge someone twice because some job ran again.

and it still does not stop there. retries, failed payments, dunning, invoice reconciliation, taxes, VAT by country, credits, discounts, custom plan shapes. every company eventually starts adding its own special little billing curse on top.

that is why billing engines keep getting rebuilt over and over again. <span data-highlight>teams think they are adding "payments" but what they are really building is a money logic system for the whole product.</span> and once the product starts changing, the billing shape starts mutating too.

it is also partly why i keep experimenting with `owostack.com`. i am interested in this layer a lot these days, not because billing is fun by itself, but because every product keeps tripping over the same messy set of problems.

i think that is the thing people miss the most. <span data-highlight>billing is not hard because of one giant algorithm. it is hard because of a hundred small decisions that keep compounding.</span>

really good read from Lago on this:

[Why billing is a nightmare - Lago](https://docs.getlago.com/guide/introduction/why-billing-is-a-nightmare)
