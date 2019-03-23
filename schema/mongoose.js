'use strict'

const mongoose = require('mongoose')
const tunnel = require('tunnel-ssh')
const config = require('./../config')

mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true)

const mongoConnection = process.env.MONGO_CONNECTION || config.MONGO_CONNECTION

var ssh = config.SSH_TUNNEL
const connect = () => {
    tunnel(ssh, function (error, server) {
        if (error) {
            console.log('SSH connection error: ' + error)
        }
        mongoose.connect(mongoConnection, { useNewUrlParser: true })
        var db = mongoose.connection
        db.on('error', console.error.bind(console, 'DB connection error:'))
        db.once('open', function () {
            console.log('DB connection successful')
        })
    })
}
module.exports = { mongoose, connect }
