'use strict'

const express = require('express')
const config = require('./config')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('./schema/mongoose')

const api = require('./routes/api')

const app = express()
app.use(bodyParser.json())

app.use(bodyParser.json())

var whitelist = [
    'http://localhost:4200'
]
var corsOptionsDelegate = function (req, callback) {
    var corsOptions
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true, credentials: true }
    } else {
        corsOptions = { origin: false, credentials: true }
    }
    callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate))

app.use('/api', api)

app.listen(config.PORT, () => {
    mongoose.connect()
    console.log(`listening on port ${config.PORT}`)
})
