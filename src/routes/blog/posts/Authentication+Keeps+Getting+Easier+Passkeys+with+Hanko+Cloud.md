---
title: Authentication Keeps Getting Easier, Passkeys with Hanko Cloud.

description: "Passkeys are a new type of authentication that is more secure and convenient than passwords. Passkeys are based on public key cryptography, which is the same cryptography that is used to secure HTTPS connections.

To use a passkey, you first need to register it with your device. This can be done using a fingerprint, face scan, or PIN. Once your passkey is registered, you can use it to authenticate to websites and apps without having to enter a password."

date: '2023-10-30'

categories:
  - svelte

  - passkeys

  - authentication

  - habitud

  - hanko

published: true
---

Are you ready to dive into the exciting world of authentication made simpler than ever? Well, you're in for a treat! I'm thrilled to share with you a game-changer that's revolutionizing the way we secure our digital lives: "Authentication Keeps Getting Easier, Passkeys with Hanko Cloud." 🚀💻

Hanko Cloud is a hosted authentication and user management solution that helps developers move beyond passwords. It is built for passkeys, a new type of passwordless authentication that is being adopted by Apple, Google, and Microsoft.

Hanko Cloud offers a number of benefits, including:

- **Security:** Passkeys are more secure than passwords because they are stored on the user's device and cannot be phished or leaked.
- **Convenience:** Passkeys are easy to use and can be used on any device.
- **Future-proofing:** Hanko Cloud is built for passkeys, so you can be confident that your authentication solution will be secure and convenient for years to come.

Hanko Cloud is easy to use (too easy I must comment). Developers can integrate Hanko Cloud into their app using the Hanko Elements web components. Hanko Cloud will then handle all of the authentication and user management, so developers can focus on building their app.

Hanko Cloud is an amazing choice for developers who want to move beyond passwords and offer their users a more secure and convenient authentication experience, and trust me, integration with your application is just seamless.

Here are some of the key features of Hanko Cloud:

- **Passkey support:** Hanko Cloud is fully integrated with passkeys, so you can start using them today.
- **Easy integration:** Hanko Cloud offers a number of integration options, including web components, SDKs, and REST APIs.
- **Strong security:** Hanko Cloud uses industry-standard security measures to protect your users' data.
- **Flexible pricing:** Hanko Cloud offers three pricing tiers to fit the needs of businesses of all sizes.

If you are looking for a hosted authentication and user management solution that is built for passkeys, Hanko Cloud is a good option to consider.

## Passkeys? What are those?

Passkeys are a new type of authentication that is more secure and convenient than passwords. Passkeys are based on public key cryptography, which is the same cryptography that is used to secure HTTPS connections.

To use a passkey, you first need to register it with your device. This can be done using a fingerprint, face scan, or PIN. Once your passkey is registered, you can use it to authenticate to websites and apps without having to enter a password.

Passkeys offer several advantages over passwords:

- **More secure:** Passkeys are more secure than passwords because they are based on public key cryptography. This makes them very difficult to crack or steal.
- **More convenient:** Passkeys are more convenient than passwords because you don't have to type them in. You can simply authenticate using your fingerprint, face scan, or PIN.
- **Universal:** Passkeys are a universal standard, so you can use them to authenticate to any website or app that supports them.

Passkeys are still in their early stages of adoption, but they are quickly gaining popularity. Several major tech companies, including Google, Apple, and Microsoft, have announced support for passkeys.

Here are some of the benefits of using passkeys:

- **Reduced risk of data breaches:** Passkeys are stored on your device, not on the servers of the websites and apps that you use. This means that they are not vulnerable to data breaches.
- **Improved user experience:** Passkeys are easier to use than passwords, and they can help to reduce password fatigue.
- **Increased security:** Passkeys are more secure than passwords because they are based on public key cryptography.

If you are looking for a more secure and convenient way to authenticate, you should consider using passkeys.

Here are some tips for using passkeys:

- **Register your passkeys with your devices:** You will need to register your passkeys with each device that you want to use them on. This process is usually very simple and can be done using a fingerprint, face scan, or PIN.
- **Use passkeys whenever possible:** If you are visiting a website or app that supports passkeys, you should use them instead of a password. Passkeys are more secure and convenient than passwords.
- **Keep your devices up to date:** It is important to keep your devices up to date with the latest security patches. This will help to protect your passkeys from being compromised.

Passkeys are a new and exciting technology that has the potential to revolutionize the way we authenticate. By using passkeys, we can make the internet a more secure and convenient place for everyone.

## How I Integrated Hanko into Habitud.

### What is Habitud?

Habitud (pronounced hab-ee-tood) is a habit-tracking app that helps you master your life. It is a simple and effective way to track your progress, set reminders, and stay motivated to achieve your goals.

Habitud also includes a number of features to help you stay motivated, such as progress tracking, streak rewards, and social sharing.

Currently, Habitud is still in beta, and features will drop in going forward.

### How I setup the Authentication with Hanko

Firstly, Habitud is built with Sveltekit (the best JS framework that will ever exist), and supabase for database management. But why not use Supabase for authentication as well, well they don't support passkeys dingos.

The first thing I did was grab the hanko-sveltekit starter template, copy/pasted all of the hanko auth components as well as the sveltekit hook.

So what the hook allows us to do is to intercept the request and maybe perform some action before the request is resolved.

In the case of Hanko hooks I copied, It uses Jose to verify the JSON Web Token (JWT) and proceed to resolve the request if it is valid, otherwise redirects to the login page, In my case '`/auth'.`

```js
import { redirect } from '@sveltejs/kit';

import { jwtVerify, decodeJwt, createRemoteJWKSet } from 'jose';
import { env } from '$env/dynamic/public';
import { handleRedirect } from '$lib';

const hankoApiUrl = env.PUBLIC_HANKO_API_URL;

const authenticatedUser = async (event) => {
	const { cookies } = event;
	const hanko = cookies.get('hanko');
	const JWKS = createRemoteJWKSet(new URL(`${hankoApiUrl}/.well-known/jwks.json`));

	try {
		await jwtVerify(hanko ?? '', JWKS);
		return true;
	} catch {
		return false;
	}
};

export const handle = async ({ event, resolve }) => {
	const verified = await authenticatedUser(event);

	if (event.url.pathname.startsWith('/streaks') && !verified) {
		throw redirect(303, handleRedirect(event));
	}
	const response = await resolve(event);
	return response;
};
```

One more Interesting thing I did was to make the user ID available In `event.locals` which I can access from anywhere In my application.

```js

import { ..., decodeJwt } from 'jose';


async function userId(cookies) {
    const token = cookies.get('hanko');
    try {
        const payload = jose.decodeJwt(token ?? '');
        const userID = payload.sub;
        return userID;
    } catch (err) {
        console.error(err);
    }
}

async function getUserID(event) {
    const { cookies } = event
    let user_id = await userId(cookies);
    return user_id;
}

export const handle = async ({ event, resolve }) => {
    event.locals.currentUserId = () => {
        return await getUserId(event)
    }
    ....
};

```

That's it for the most part of the verification process and to build the auth page, all you need to do is:

`/auth` `+page.svelte`

```svelte
<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { register } from '@teamhanko/hanko-elements';
	import { env } from '$env/dynamic/public';
	import { page } from '$app/stores';
	const hankoApi = env.PUBLIC_HANKO_API_URL;

	const redirectAfterLogin = () => {
		let redirect = $page.url.searchParams.get('redirectTo');
		goto(redirect ?? '/streaks');
	};

	onMount(async () => {
		register(hankoApi).catch((error) => {
			// handle error
		});
	});
</script>

<hanko-auth on:onAuthFlowCompleted={redirectAfterLogin} />
```

One issue you will face is because of Svelte's `SSR` and you can disable this:

`/auth` `+page.js`

```js
export const ssr = false;
```

In the current setup, a robust authentication system is already in place, ensuring secure access control. Additionally, users are equipped with the capability to sign in using passkeys, which adds a layer of convenience and ease to the authentication process. With these features at your disposal, you can enjoy a seamless and worry-free user experience.

**Get Started with Hanko Cloud** - [https://www.hanko.io/](https://www.hanko.io/)

**Start Tracking your Habits with** - [Habitud](https://habitud.vercel.app)

### Happy Hacking!
