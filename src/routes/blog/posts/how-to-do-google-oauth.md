---
title: 'How to implement Google OAuth from scratch: No Libraries, Just APIs'

description: 'Google OAUTH is fairly easy to configure, and this article will be walking you through the entire process without using any packages, wrappers or helpers.'

date: '2025-04-18'

lastmod: '2025-04-18'

categories:
  - product launch

label: '<a href="/category/product%20launch">product launch</a>'

published: true
---

OAUTH by far has been the most preferred authentication method in recent times. it simply just really convenient and strips away the burden to memorize passwords for yet another website or resetting it for the 100th time.

It makes sense to have OAUTH, otherwise you’re throwing away a convenience that could reduce the friction of users actually trying out your product without the seemingly daunting traditional password on-boarding method.

That being said, OAUTH is fairly easy to configure, and this article will be walking you through the entire process without using any packages, wrappers or helpers.

> Prerequisite: the implementation will be written in FastAPI and we’re going to be bear bones with our HTML (just an HTML response from our FastAPI). This process can easily be replicated with any front-end - back-end language/framework of choice.

## The Roadmap

- Get our OAUTH credentials from googles.
- Configure our backend authentication call to google.
- Configure client/frontend to request authentication
- Generate jwt token to authenticate subsequent request to backend
- Test with an endpoint to get user details.

## Step 1. (One)

Just like any google products for developers, the UI/UX is a bit rough to navigate. needless to say it not always intuitive where to go to find “what” on their platforms. But the good thing is that you will only need to do this once in while, and I will be guiding you through.

- Login to cloud console: https://console.cloud.google.com.

- you might want to create a new project or organization for this or just use existing project:

![](https://paper-attachments.dropboxusercontent.com/s_A743F681CA32DC373F23A760C0DA2612AC195404A362AD61CAFCF36DB2D3AE1B_1743678310107_image.png)

- Once in your desired project/org you should navigate to api/services:
  ![](https://paper-attachments.dropboxusercontent.com/s_A743F681CA32DC373F23A760C0DA2612AC195404A362AD61CAFCF36DB2D3AE1B_1743678692776_image.png)

- Once you’re there you want to click the oauth consent screen:
  ![](https://paper-attachments.dropboxusercontent.com/s_A743F681CA32DC373F23A760C0DA2612AC195404A362AD61CAFCF36DB2D3AE1B_1743678781276_image.png)

- then to clients:
  ![](https://paper-attachments.dropboxusercontent.com/s_A743F681CA32DC373F23A760C0DA2612AC195404A362AD61CAFCF36DB2D3AE1B_1743678847064_image.png)

Before that though, you might be prompted to create a app info:

![](https://paper-attachments.dropboxusercontent.com/s_A743F681CA32DC373F23A760C0DA2612AC195404A362AD61CAFCF36DB2D3AE1B_1743762691205_image.png)

Once you’re in client, the rests of the UI is quite intuitive.

- Create a new client, choose web applcation as the type:
  ![](https://paper-attachments.dropboxusercontent.com/s_A743F681CA32DC373F23A760C0DA2612AC195404A362AD61CAFCF36DB2D3AE1B_1743679006457_image.png)

The only required inputs from us will be our client URL and then our backend redirect URI or callback.

- The client URL with be the authorized URL origin that can request the OAUTH consent screen.
- Then our redirect URI or callback will the be the URI the google will be calling to with the AUTH code.

> Note that we don’t have any of those urls yet. i will be filling mine with these:
> client: http://localhost:8000/
> redirect URI: http://localhost:8000/auth/redirect/google

> also it possible to have multiple client origins, and redirect urls/uris or callbacks.

When you’ve filled those up appropriately, you will be given a client ID and also a client secret. These along with the redirect URL/callback will be used to authenticate your request to google OAUTH.

## Step 2. (Two)

In this step we will be writing our Frontend + Backend to kick off the AUTH flow.

which all we need to do is redirect our user to this URL:

```txt
https://accounts.google.com/o/oauth2/auth?client_id={GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email%20profile&access_type=offline
```

and here is the breakdown of this URL:

This URL initiates the OAuth 2.0 authorization flow with Google.

---

**Base URL**

```txt
https://accounts.google.com/o/oauth2/auth
```

This is Google's endpoint for starting the OAuth 2.0 authentication process. When a user visits this URL, they’re shown a Google login screen (if not already logged in) and asked to authorize your app.

---

**Query Parameters**

1. `client_id={GOOGLE_CLIENT_ID}`
   This should be your unique OAuth 2.0 client ID we obtained earlier.

---

2. `redirect_uri=${REDIRECT_URI}`
   The URI or callback where the user is sent after granting or denying permission.

---

3. `response_type=code`

- **Purpose**: Indicates that your app is requesting an **authorization code**, which will later be exchanged for an access token.
- **Why** `**code**`**?** Because this is part of the **Authorization Code Grant** flow.

---

4. `scope=email%20profile`

- Tells Google what information your app wants to access.
- **Breakdown**: `%20` is a space, so this means:
  - `email`: Access to the user’s email address.
  - `profile`: Basic profile info (name, photo, etc.).

---

5. `access_type=offline`

- Requests a **refresh token** in addition to the access token.

The setup is pretty much done with this, and what we can do is just construct this URL from let say our frontend and then redirect to it.

```html
<main class="container">
  <h1>Sign In</h1>
  <button class="google-button" onclick="signInWithGoogle()">
    <img
      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
      alt="Google logo"
      class="google-logo"
    />
    Sign in with Google
  </button>
</main>

<script>
  function signInWithGoogle() {
    const URL = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email%20profile&access_type=offline`;
  }
  window.location.href = URL;
</script>
```

We might be lucky to get our consent screen on first trial like this:

![](https://paper-attachments.dropboxusercontent.com/s_A743F681CA32DC373F23A760C0DA2612AC195404A362AD61CAFCF36DB2D3AE1B_1743762875276_image.png)

## Step 3. (Three)

Our backend is the next thing on our list.

There are two proceess to completing the oauth with google thingy:

1. using the code provided in the redirect/callback to get a token,
2. using that token the get the user data.

The urls for both of these actions are as follows:

To get the token:
URL: https://oauth2.googleapis.com/token
Method: POST
headers: "Content-Type": "application/x-www-form-urlencoded",

body:

```txt
client_id: c.env.GOOGLE_CLIENT_ID,
client_secret: c.env.GOOGLE_CLIENT_SECRET,
code,
grant_type: "authorization_code",
redirect_uri: c.env.GOTO,
```

that part might look like this:

```py
@app.get('/auth/redirect/google')
def authenticate(code: Annotated[str, Query(code="code")]):
    # NOTE: we're getting our code from the query param
    url = "https://oauth2.googleapis.com/token"
    credentials_response = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": REDIRECT_URI
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    credentials = requests.post(url, data=data, headers=headers)

    return credentials
```

The response will look something like this:

![](https://paper-attachments.dropboxusercontent.com/s_A743F681CA32DC373F23A760C0DA2612AC195404A362AD61CAFCF36DB2D3AE1B_1743764318156_image.png)

At this point, we’re already good to go. And the last step is to have the user info, and we will be using the next api for that.

To get the userinfo:
URL: https://www.googleapis.com/oauth2/v2/userinfo
Method: GET
headers:  Authorization: `Bearer ${access token gotten from the previous response`

To put all of this together. our final function will look like this:

```py
@app.get('/auth/redirect/google')
def authenticate(code: Annotated[str, Query(code="code")]):
    url = "https://oauth2.googleapis.com/token"
    data = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": REDIRECT_URI
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    credentials_response = requests.post(url, data=data, headers=headers)
    credentials = credentials_response.json()

    access_token = credentials['access_token']
    user_info_url = 'https://www.googleapis.com/oauth2/v2/userinfo'

    headers_2 = {
            'Authorization': f"Bearer {access_token}"
    }

    user_info_response = requests.get(user_info_url, headers=headers_2)
    user_info = user_info_response.json()

    return user_info
```

![](https://paper-attachments.dropboxusercontent.com/s_A743F681CA32DC373F23A760C0DA2612AC195404A362AD61CAFCF36DB2D3AE1B_1744993718168_annotely_image.png)

So, at this point, we’re like 60% into this, and so far it not much code.

But a key step we might omit or just gloss over is adding this user to our database, in most cases you just UPSERT this data into your db.

To do something like this with SQLite for example will be:

```sql
INSERT INTO users (email, name, profile, provider, provider_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(provider_id)
    DO UPDATE SET
        email = excluded.email,
        name = excluded.name,
        profile = excluded.profile,
        updated_at = CURRENT_TIMESTAMP
    RETURNING id;`
```

where provider and provider_id will be “google” and the google user id that was returned in the response;

> The purpose of provider and provider_id, is so you can have maybe multiple oauth providers. alongside maybe passwords, though we’re not covering that much broadly in this article.

## Step 4. (Four)

Now that we can have the flow almost completed. i.e we can request authentication and then get user data back. we of course want to generate let say some kinda token (JWT) we can pass to our frontend/client which the client will be using to authentication with our APIs.

Let use the pyJWT to create a our token.

```bash
uv tool add pyjwt
```

```py
import jwt
# ....
# Your secret key (keep it safe)
SECRET_KEY = "your-super-secret"

# Payload data
payload = {
    "sub": , 'user' # subject,
    "info": user_info
    "iat": datetime.datetime.utcnow(),  # issued at
    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),  # expires in 1 hour
}

# Generate the JWT
token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
```

once the token is generated. we will attach to a redirect back to the client, then store maybe in localStorage, cookie or whatever storage method that is suitable for your use case.

The final code look like this:

```py
@app.get('/auth/redirect/google')
def authenticate(code: Annotated[str, Query(code="code")]):
    url = "https://oauth2.googleapis.com/token"
    data = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": REDIRECT_URI
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    credentials_response = requests.post(url, data=data, headers=headers)
    credentials = credentials_response.json()
    # return credentials
    access_token = credentials['access_token']
    user_info_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
    headers = {
            'Authorization': f"Bearer {access_token}"
    }
    user_info_response = requests.get(user_info_url, headers=headers)
    user_info = user_info_response.json();
    user_id  = user_info['id']
    payload = {
    "sub": user_id,
    'info': user_info,
    "iat": datetime.datetime.utcnow(),  # issued at
    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),  # expires in 1 hour
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return RedirectResponse(url=f"http://localhost:8000?token={token}")

```

for us we will be storing it in localStorage, and we will redirect to ‘/dashboard’ when user is logged in.

So I’m using this self calling function to get the token, and redirect user to dashboard.

> if you’re using the more capable full-stack frameworks, you can easily take advantage of server side rendering to hijack the token, store it in cookies maybe and then redirect them without any noticeable delay compared to doing that on the client.

```js
(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token") || localStorage.getItem("auth_token");
  if (token) {
    localStorage.setItem("auth_token", token);
    // Optional: Redirect to a dashboard or another page
    window.location.href = "/dashboard";
  } else {
    document.getElementById("signin-container").style.display = "block";
  }
})();
```

This pretty completes our authentication. This process manages both sign up and sign in without any further configuration.

## Step 5. (Five)

To complete the process entirely, we might want to look at how we will use that token to authorize requests to our api.

In FastAPI we can easily create a middle that would sit between every requests coming into our API, fetch that JWT token, try to decode it and pass down the payload to the request.

so our middleware will look something like this, also i’m excluding some paths as they will not be requiring any auth.

```py
EXCLUDE_PATHS = ['/', '/auth/redirect/google']
EXCLUDE_PREFIXES = []

class JWTMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        if path in EXCLUDE_PATHS or any(path.startswith(prefix) for prefix in EXCLUDE_PREFIXES):
            return await call_next(request)
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split("Bearer ")[1]
            try:
                print(token)
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                request.state.user = payload
            except PyJWTError:
                return JSONResponse({"detail": "Invalid or expired token"}, status_code=401)
        else:
            return JSONResponse({"detail": "Authorization header missing"}, status_code=401)
        return await call_next(request)


app.add_middleware(JWTMiddleware)
```

so now let try something fun, since we’re storing the user info in the jwt, we can just have a route that would do cool stuff like this:

```py
@app.get('/user/details')
def get_user_details(request: Request):
    user = getattr(request.state, "user", None)
    return {"user":user.info}
```

this get the user that has been passed down from the middleware and returns it.

REMEMBER the user_info we’re storing in our JWT token:

```py

payload = {
    "sub": , 'user' # subject,
    "info": user_info
    "iat": datetime.datetime.utcnow(),  # issued at
    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),  # expires in 1 hour
}

```

hence we could do something like this in our Frontend:

```js
try {
  const token = localStorage.getItem("auth_token");
  const res = await fetch("http://localhost:8000/user/details", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Invalid token");
  }
  const data = await res.json();
  document.getElementById(
    "user-info"
  ).textContent = `Hello, ${data.user.name} (${data.user.email})`;
} catch (err) {
  console.error(err);
}
```

![](https://paper-attachments.dropboxusercontent.com/s_A743F681CA32DC373F23A760C0DA2612AC195404A362AD61CAFCF36DB2D3AE1B_1743794419084_image.png)

So this pretty much completes this oauth implementation. There is obviously a lot of things you can achieve on your own without any other wrapper, package or library.

What I’ve implementation here might seem bear bones, but it how most web app do oauth authentication. I’ve just strip away the abstraction to give you a clear picture of how it really works, and how less of an effort it is to implement on your own.

If you would like the full code to this, it actually just a one main.py file and you’re free to inspect all of the code [here](https://github.com/Abdulmumin1/oauth-tutorial).

Delight!