'use strict'
const { mongoose } = require('./mongoose')

let crimeSchema = new mongoose.Schema({
    category: String,
    latitude: Number,
    longitude: Number,
    month: String,
    crimeId: Number
},
{
    timestamps: true
})

let Crime = mongoose.model('Crime', crimeSchema)
module.exports = { Crime }
