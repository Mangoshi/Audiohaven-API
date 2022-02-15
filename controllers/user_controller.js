const User = require('../models/user_schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//TODO: Function for updating user so Spotify token can be saved

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

// const updateToken = (id, access_token, refresh_token) => {
//     User.findOneAndUpdate(
//         { _id: id },
//         { "tokens.spotify.access_token" : access_token, "tokens.spotify.refresh_token" : refresh_token }
//     )
//         .then((data) =>{
//             if(data){
//                 res.status(200).json(data)
//             }
//             else{
//                 res.status(404).json(`User with id: ${req.params.id} not found!`)
//             }
//         })
//         .catch((err)=>{
//             console.error(err)
//             res.status(500).json(err)
//         })
// }

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

// TODO: Remove / Make admin-only
const addUser = (req, res) => {
    // create userData variable and assign it the request-body's data
    let userData = req.body
    // create a new User Object with userData
    User.create(userData)
        .then((data) =>{
            // Then, if successful:
            if(data){
                // Respond with 201: Created
                res.status(201).json(data)
            }
        })
        .catch((err)=>{
            // If an error is caught & its name parameter equal to 'ValidationError'
            if(err.name === "ValidationError"){
                // Respond with 422: Unprocessable Entity
                res.status(422).json(err)
            }
            // Else if a different type of error is caught
            else {
                // Print error to console
                console.error(err)
                // Respond with 500: Internal Server Error
                res.status(500).json(err)
            }
        })
    // Lastly, respond with userData
    res.json(userData)
}

// TODO: Stop getUser() from returning secret details / Make admin-only
const getUser = (req, res) => {
    User.findById(req.params.id)
        .then((data) =>{
            if(data){
                res.status(200).json(data)
            }
            else{
                res.status(404).json(`User with id: ${req.params.id} not found!`)
            }
        })
        .catch((err)=>{
            console.error(err)
            res.status(500).json(err)
        })
}

// TODO: Remove / Make admin-only
const getAllUsers = (req, res) => {
    User.find()
        .then((data) =>{
            if(data){
                // 200: OK
                res.status(200).json(data)
            }
            else {
                // 404: Not Found
                res.status(404).json("No user found!")
            }
        })
        .catch((err)=>{
            console.error(err)
            // 500: Internal Server Error
            res.status(500).json(err)
        })
}

module.exports = {
    registerUser,
    loginUser,
    loginRequired,
    getAllUsers,
    getUser,
    addUser,
    // updateToken
}