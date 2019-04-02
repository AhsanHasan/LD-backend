'use strict'
const { mongoose } = require('./mongoose')

let propertySchema = new mongoose.Schema({
    bathroom_number: Number,
    bedroom_number: Number,
    car_spaces: Number,
    construction_year: Number,
    latitude: Number,
    longitude: Number,
    price: Number,
    property_type: String,
    title: String,
    postCode: String,
    borough: String
},
{
    timestamps: true
})

let Property = mongoose.model('Property', propertySchema)
module.exports = { Property }
