const { Schema, model } = require('mongoose')

// User Model
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required!']
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    }
})

module.exports = model('User', userSchema)