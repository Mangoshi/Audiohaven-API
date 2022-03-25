const User = require('../models/user_schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = (req, res) => {
    // assign newUser to a new User Object from user_schema, using the request body
    let newUser = new User(req.body)
    // use bcrypt to hash the password. hashSync(password, salt)
    newUser.password = bcrypt.hashSync(req.body.password, 10)
    // save the new user to the DB
    newUser.save((error, user) => {
        // if there is an error, respond with status 400 and send error back
        if(error){
            return res.status(400).send({
                message: error
            })
        }
        // else if successful
        else {
            // remove hashed password before responding to the client
            user.password = undefined
            // return the new user to the client
            return res.json(user)
        }
    })
}

const loginUser = (req, res) => {
    // Connect to DB, and find the user that has...
    User.findOne({
        // ...an email matching the email in the request body
        email: req.body.email,
    }) // Then...
        .then(user => {
            // ... if user is invalid, OR if comparePassword from user_schema fails
            if(!user || !user.comparePassword(req.body.password)){
                // Respond with a status 401: Unauthorised & an error message
                return res.status(401).json({
                    message: 'Authentication failed: Invalid credentials.'
                })
            }
            // Respond with a token
            res.json({
                // Sign the token with jsonwebtoken using a payload of username, email & id, and 'audiohaven' as our secret-key
                token: jwt.sign({
                    username: user.username,
                    email: user.email,
                    _id: user._id
                }, 'audiohaven')
            })
        })
        // If an error occurs, catch & throw the error
        .catch(error => {
            throw error
        })
}

//// Router -> Controller Middleware ////
const loginRequired = (req, res, next) => {
    // If the user exists, move on
    if(req.user){
        next()
    }
    // Else if the user doesn't exist
    else{
        // Respond with a status 401: Unauthorized...
        return res.status(401).json({
            // ...and return this message
            message: 'Unauthorized user!'
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    loginRequired,
}