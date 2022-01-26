# Audiohaven-API

IADT Y3 - Professional Practice Project

## Project setup <small>(Requires a MongoDB database)</small>

1. Run ``npm install`` in your terminal at the root directory.

2. Create a ``.env`` file at the root directory. This is to hold private environment variables.

3. In the ``.env`` file, type ``DB_ATLAS_URL=`` followed by your MongoDB connection string.

#### It will look something like this, but with your credentials:

```
DB_ATLAS_URL=mongodb+srv://<username>:<password>@cluster0.0amnt.mongodb.net/<database>?retryWrites=true&w=majority
```

(Optional) You can also set an alternate port the local server will run on with ``PORT=1234`` on a different line.

## Start server

With nodemon (auto-refresh on save)

```
npm run dev
```

Without nodemon (no auto-refresh)

```
npm run start
```
