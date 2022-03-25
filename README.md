# Audiohaven-API

IADT Y3 - Professional Practice Project
<br>

## Initial setup <small>(Requires a [MongoDB](https://www.mongodb.com/) database)</small>

1. Run ``npm install`` in your terminal at the root directory.

2. Create a ``.env`` file at the root directory. This is to hold private environment variables.

3. In the ``.env`` file, type ``DB_ATLAS_URL=`` followed by your [MongoDB connection string](https://www.mongodb.com/docs/atlas/tutorial/connect-to-your-cluster/#click-connect-3).
4. On a new line, type ``SERVER_LISTENING_AT=`` followed by your server's root URL.

#### It will look something like this, but with your credentials:

```
DB_ATLAS_URL=mongodb+srv://<username>:<password>@cluster0.0amnt.mongodb.net/<database>?retryWrites=true&w=majority
SERVER_LISTENING_AT=http://localhost:3000
```

(Optional) You can also set an alternate port for the local server to run on with e.g. ``PORT=1234`` on a different line.
<br>

## Start the server

With nodemon (auto-refresh on save)

```
npm run dev
```

Without nodemon (no auto-refresh)

```
npm run start
```

## Spotify setup <small>(Requires a [Spotify Application](https://developer.spotify.com/dashboard))</small>

1. In the ``.env`` file, type ``SPOTIFY_CLIENT_ID=`` followed by your private Spotify client ID. 
2. On a new line, type ``SPOTIFY_CLIENT_SECRET=`` followed by your private Spotify client secret.
3. On a new line, type ``REDIRECT_URI=`` followed by your server URL + ``/spotify/callback``
4. On a new line, type ``SPOTIFY_REDIRECT=`` followed by the URL you would like to be redirected to after the OAuth2 handshake has been made.

#### It will look something like this, but with your credentials:

```
SPOTIFY_CLIENT_ID=abcdefg
SPOTIFY_CLIENT_SECRET=hijklmnop
REDIRECT_URI=http://localhost:3000/spotify/callback
SPOTIFY_REDIRECT=http://localhost:8080/spotify
```

***Note: ``REDIRECT_URI`` needs to be whitelisted in your Spotify Application settings.<br>
Also, it isn't necessary to hide this, it just makes it easier to change further down the line when using a hosting provider such as Heroku.***

## Hosting
- If you want to host your new application, you will need to use a hosting provider which supports environment variables. We used Heroku in this case.
- This way, you can override the variables you set in the ``.env`` file with their live counterparts. ie. ``localhost:3000`` becomes ``your-live-site.com``
- The only variables that will remain unchanged are ``DB_ATLAS_URL``, ``SPOTIFY_CLIENT_ID``, and ``SPOTIFY_CLIENT_SECRET``. 
- Your ``REDIRECT_URI`` and ``SERVER_LISTENING_AT`` variables will point to the hosted version of the server, and your ``SPOTIFY_REDIRECT`` will point to the hosted version of your frontend.

<hr>

#### And that's it! Happy coding!
