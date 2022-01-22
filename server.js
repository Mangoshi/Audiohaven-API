// initialise express package as constant
const express = require('express')
// initialise cors package as constant
const cors = require('cors')

// initialise dotenv package
require('dotenv').config()
// initialise db.js
require('./db')()

// initialise userController methods
const { getAllUsers, getUser, addUser } = require('./controllers/user_controller')

// the port express will use (port number from environment variable OR 3000)
const port = process.env.PORT || 3000

// app is our instance of express
const app = express()
// app will use cors to solve CORs issues
app.use(cors())
// app will always use JSON
app.use(express.json())

//  Routing  //
app.get('/', (req, res) => { res.json('Welcome to Audiohaven API!') })
app.get('/users', getAllUsers)
app.get('/users/:id', getUser)
app.post('/users', addUser)

//  Listening  //
app.listen(port, () => {
    console.log(`Audiohaven listening at http://localhost:${port}`)
})