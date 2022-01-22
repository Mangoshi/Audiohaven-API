const mongoose = require('mongoose')

const init = () => {
    // enabling debug mode
    mongoose.set('debug', true)
    // connect to DB_ATLAS_URL environment variable and pass in options after comma
    mongoose.connect(process.env.DB_ATLAS_URL, {
        useNewUrlParser: true
    })
    // if something goes wrong, catch error
    .catch((err) =>{
        // log error to console
        console.error('error: ', err.stack)
        // stop server
        process.exit(1)
    })
    // when the connection is open..
    mongoose.connection.on('open', () => {
        // log 'connected to database'
        console.log('Connected to database! ^_^')
    })
}

mongoose.Promise = global.Promise

module.exports = init