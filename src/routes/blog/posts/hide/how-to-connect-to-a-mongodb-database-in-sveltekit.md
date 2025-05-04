---
title: 'How to connect to a MongoDB database in Sveltekit'

description: 'MongoDB is a document-oriented database, which means it allows for flexible and dynamic schema design. This flexibility is particularly beneficial in scenarios where the data structure evolves over time. In this article, we will take a look at a non-obvious trick that many Sveltekit users have used to securely connect to their Mongo database.'

date: '2024-01-23'

lastmod: '2024-01-23'

categories:
  - sveltekit
  - mongodb
  - tips
  - webdev
  - svelte

visual: false

published: true
---

While a database like Mongo is not the go-to choice for a lot of devs, It has gained quite a few honest users and a thriving community. If you’re here, you are likely part of this community.

MongoDB is a document-oriented database, which means it allows for flexible and dynamic schema design. This flexibility is particularly beneficial in scenarios where the data structure evolves over time.

In this article, we will take a look at a non-obvious trick that many Sveltekit users have used to securely connect to their Mongo database.

## How?

We will be utilizing the Sveltekit hook for this, as it allows us to create the connection only once, before starting the server.

Sounds confusing? here is an example.

### 1. Create our MongoDB client

`mongo.ts`

```js
import { MONGO_URL } from '$env/static/private';
import { MongoClient } from 'mongodb';

const client = new MongoClient(MONGO_URL);

// connect to the database
export async function connect(): Promise<void> {
	await client.connect();
}
```

> If you’re not familiar with Sveltekit `$env` management — Environment variables in `process.env` are also available via `$env/static/private`.

### 2. Execute the connection in Sveltekit hook.

`hooks.server.ts`

```js
import { connect } from '$db/mongo';

// Connect to MongoDB before starting the server
connect()
	.then((): void => {
		console.log('MongoDB started');
	})
	.catch((e) => {
		console.log('MongoDB failed to start');
		console.log(e);
	});
```

This will allow the database connection to happen only once, and that too before starting the app. _Most_ of us are familiar with using the hook with the handle function that can intercept requests and is used to secure routes.

But that only happens to stuff in the handle functions, every other thing invoked outside of the handle function will be executed only once before the app starts.

There you have it, how to connect your MongoDB in Sveltekit. Good luck playing around with NoSQL 😅

Peace ✌️
