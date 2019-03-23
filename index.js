'use strict'

const express = require('express')
const config = require('./config')
const bodyParser = require('body-parser')
const mongoose = require('./schema/mongoose')

const api = require('./routes/api')

const app = express()
app.use(bodyParser.json())
app.use('/api', api)

app.listen(config.PORT, () => {
    mongoose.connect()
    console.log(`listening on port ${config.PORT}`)
})
