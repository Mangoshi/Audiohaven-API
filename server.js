// initialise express package as constant (import Express.js)
const express = require('express')
// initialise cors package as constant (import CORS library)
const cors = require('cors')
// import jsonwebtoken as 'jwt'
const jwt = require('jsonwebtoken')

// initialise dotenv package (environment variables)
require('dotenv').config()
// initialise db.js (import database config)
require('./db')()

// initialise userController methods
const { registerUser, loginUser } = require('./controllers/user_controller')

// the port express will use (port number from environment variable OR 3000)
const port = process.env.PORT || 3000

// app is our instance of express
const app = express()
// app will use cors to solve CORs issues
app.use(cors())
// app will always use JSON
app.use(express.json())

// defining middleware to run on requests prior to routing
app.use((req, res, next) => {
    // IF headers exist,
    // AND authorisation headers exists,
    // AND the first index of authorisation headers split (with <Space> character as a separator), is equal to 'Bearer'
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
        // Using jsonwebtoken.verify to check if the second index of the authorisation-header split (the token) is valid
        // It checks this against our secret key, and then runs a callback function to see if everything went okay or not
        jwt.verify(req.headers.authorization.split(' ')[1],'audiohaven', (error, decode) => {
            // if there's an error, set request.user to undefined
            if(error) req.user = undefined
            // otherwise, set request.user to equal the decoded version of the token (username/email/_id)
            req.user = decode
            // move on to the next thing (in this case it's routing, but it could be other middleware)
            next()
        })
    }
    // if not...
    else {
        // make request's user parameter undefined
        req.user = undefined
        // move on to routing
        next()
    }
})

//  Unauthorised Routing  //
//  No token required :)  //
app.get('/', (req, res) => { res.json('Welcome to Audiohaven API!') })
app.post('/register', registerUser)
app.post('/login', loginUser)

// API Routing //
app.use('/spotify', require('./routes/spotify'))

//  Listening  //
app.listen(port, () => {
    console.log(`Audiohaven API is live ^_^\nListening at: ${process.env.SERVER_LISTENING_AT}`)
})

module.exports = app
