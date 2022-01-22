const express = require('express')
const cors = require('cors')

require('dotenv').config()

const app = express() // app is our instance of express
const port = 3000 // the port express will use

//  Routes  //
app.get('/', (req, res) => {
    res.json('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})