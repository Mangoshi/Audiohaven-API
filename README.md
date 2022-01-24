# Audiohaven-API
IADT Y3 - Professional Practice Project

## Project setup
1. Run ``npm install`` in your terminal at the root directory.

2. Create a ``.env`` file at the root directory. This is to hold private environment variables.

3. In the ``.env`` file, type ``DB_ATLAS_URL=`` followed by your MongoDB connection string.

### It will look something like this, but with your credentials:
```DB_ATLAS_URL=mongodb+srv://<username>:<password>@cluster0.0amnt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority```

### You can also set an alternate port the server will run on locally like so:
```PORT=3000```

## Start server
```
npm run start
```
