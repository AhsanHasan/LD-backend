'use strict'
const { mongoose } = require('./mongoose')

let crimeSchema = new mongoose.Schema({
    category: String,
    latitude: Number,
    longitude: Number,
    month: String,
    crimeId: Number,
    postCode: String,
    borough: String
},
{
    timestamps: true
})
crimeSchema.index({ crimeId: 1 }, { unique: true })
let Crime = mongoose.model('Crime', crimeSchema)
module.exports = { Crime }
