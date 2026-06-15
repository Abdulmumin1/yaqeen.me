---
title: 'Experimenting with a provider agnostic usage-based billing engine'

description: "experimenting with a provider agnostic billing engine"

date: '2026-01-17'

lastmod: '2026-01-17'

categories:
  - billing
  - paystack
  - saas

published: true
---

i slopforked of `@autumnpricing` to make it provider agnostic, but the original reason was simpler: I want to use it with paystack. that is the provider i mostly use to setup billing for most of my contract works. 

The problem autumn was solving is very real, and i felt it first-hand. The first time i saw the product (i think it was a sponsored spot on some youtube video) i was like this is it! this is it! like really.. THIS IS IT.

Yeah, <span data-highlight>teams reinvent the billing engine for every new product.</span> you can't experiment with different distinct pricing shapes quickly as it would take time. it rewiring the product all over again... mostly!

and maybe not a problem for smol saas, but those that build for scale, it is real problem, a lot of time will be spent patching billing they thought works like magic in early stage.

<span data-highlight>Autumpricing is great, but i had to fix it for me. to work for me and my local network.. for the companies i care about.</span>

so i created a project literaly called `paystack-wrapper` that where this new idea sat. benign to me at the time was, just a few hours into scibbling something together, it would not be just paystack wrapper anymore. i would end up designing it to be provider agnostic.

yet, still would only start to support providers i know people in my network that use.

i call it owostack. `owo` in my language means moneeyy, so it moneystack :) 

Funny though, I called it a slopfork. 

It was written from scratch.

see [owostack.com](owostack.com)
