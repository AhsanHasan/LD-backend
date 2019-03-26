'use strict'
const { mongoose } = require('./mongoose')

let optionSchema = new mongoose.Schema({
    url: String
})

let Option = mongoose.model('Option', optionSchema)
module.exports = { Option }
