---
title: 'Hono OpenAPI makes me mad'

description: 'i fell in love with hono because it was simple, then openapi showed up and made the whole thing feel less simple very fast.'

date: '2026-04-19'

lastmod: '2026-04-19'

categories:
  - hono
  - api
  - randoms

published: true
---

I fell in love with hono because it was simple.

route in. handler. response out. no weird ceremony and boilder code. just write the thing and move on. i call it the [svelte](/svelte-is-great) for apis.

then i touched `@hono/zod-openapi` and the spell kinda broke.

because now the route is not just a route anymore.
it is a route, a schema, a spec object, a response contract, a docs generator, and somehow still the handler too.

and that is where the annoyance starts.

look at a normal hono handler:

```ts
app.post("/customers", async (c) => {
  const body = await c.req.json();
  const parsed = customerSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ success: false, error: "bad request" }, 400);
  }

  const customer = await createCustomer(parsed.data);
  return c.json({ success: true, customer }, 200);
});
```

that is clean enough.
you can see the whole shape of the thing in one breath.

now compare that with the openapi version.

```ts
const createCustomerRoute = createRoute({
  method: "post",
  path: "/customers",
  operationId: "createCustomer",
  tags: ["Customers"],
  summary: "Create or resolve a customer",
  description: "Creates a customer, or resolves existing customer by ID or email.",
  security: apiKeySecurity,
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: customerSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Customer returned successfully",
      ...jsonContent(customerResponseSchema),
    },
    400: badRequestResponse,
    401: unauthorizedResponse,
    409: conflictResponse,
    500: internalServerErrorResponse,
  },
  const customer = await createCustomer(parsed.data);
  return c.json({ success: true, customer }, 200);
});
```

first you define the schema.
then you define the route.
then you define the request body.
then you define the response body.
then you still parse the body again in the handler.
then you still map errors yourself.

so what exactly is being simplified here?

because from where i am standing, i am just writing the same truth in three different places and hoping none of them drift.

that is the part that gets me.

not that openapi is bad, openapi is useful, but other frameworks does it better than hono.

but i picked hono because it felt light, but this? really? if not for clankers, i would not write any of that by hand.

the file becomes huge, too.
one little feature turns into a wall of zod schemas, route metadata, response wrappers, and little helper constants for every possible status code. the actual handler logic starts feeling like the side quest.

i know the argument. "this is the contract.", "this gives you docs.", "this makes the api explicit."
sure.

but now the contract is also code i have to maintain by hand.
so when i change a field in the handler, i have to remember to go edit the route definition too.
when i add a response shape, i have to update the openapi bit too.
when i move something around, i have to mentally sync both halves.

as i said, if not for clankers, i would have moved to something better, maybe elysia. write these these by hand? hell nah. 

so yeah.

i still like hono a lot.
but, will def move when i can convience myself to another stuff :)
