const User = require('../models/user_schema')

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

const addUser = (req, res) => {
    let userData = req.body
    User.create(userData)
    .then((data) =>{
        if(data){
            // 201: Created
            res.status(201).json(data)
        }
    })
    .catch((err)=>{
        if(err.name === "ValidationError"){
            // 422: Unprocessable Entity
            res.status(422).json(err) 
        }
        else {
            console.error(err)
            res.status(500).json(err)
        }
    })
    res.json(userData)
}

module.exports = {
    getAllUsers,
    getUser,
    addUser
}