const { ErrorHandler } = require('./../utils/ErrorHandler')
const { Property } = require('./../schema/property')
const rp = require('request-promise')
const url = require('./../utils/url')

class PropertySeeder {
    /**
     * Insert data in property collection from the api
     */

    static async seed () {
        try {
            let totalNumberOfPages = 2824
            let propertyArray = []
            for (let i = 0; i < totalNumberOfPages; i++) {
                propertyArray = []
                console.log((i / totalNumberOfPages) * 100)
                let option = {
                    uri: 'https://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&country=uk&listing_type=buy&place_name=london&page=' + i,
                    json: true
                }
                await rp(option)
                    .then(function (repos) {
                        repos.response.listings.forEach(async (element) => {
                            let postCodeCheck = {
                                url: 'https://api.postcodes.io/outcodes?lon=' + element.longitude + '&lat=' + element.latitude,
                                json: true
                            }
                            await rp(postCodeCheck)
                                .then(function (postal) {
                                    let property = {
                                        bathroom_number: element.bathroom_number,
                                        bedroom_number: element.bedroom_number,
                                        car_spaces: element.car_spaces,
                                        construction_year: element.construction_year,
                                        latitude: element.latitude,
                                        longitude: element.longitude,
                                        price: element.price,
                                        property_type: element.property_type,
                                        title: element.title,
                                        postCode: postal.result[0].outcode
                                    }
                                    propertyArray.push(property)
                                })
                                .catch(function (err) {
                                    console.log(err)
                                    let property = {
                                        bathroom_number: element.bathroom_number,
                                        bedroom_number: element.bedroom_number,
                                        car_spaces: element.car_spaces,
                                        construction_year: element.construction_year,
                                        latitude: element.latitude,
                                        longitude: element.longitude,
                                        price: element.price,
                                        property_type: element.property_type,
                                        title: element.title,
                                        postCode: ''
                                    }
                                    propertyArray.push(property)
                                })
                        })
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
                await Property.insertMany(propertyArray)
            }
        } catch (error) {
            ErrorHandler.sendError(error)
        }
    }
}
module.exports = { PropertySeeder }
