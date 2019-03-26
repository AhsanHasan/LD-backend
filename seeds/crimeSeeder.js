const { ErrorHandler } = require('./../utils/ErrorHandler')
const { Property } = require('./../schema/property')
const { Crime } = require('./../schema/crime')
const rp = require('request-promise')
const url = require('./../utils/url')
const { forEach } = require('p-iteration')

class CrimeSeeder {
    /**
     * Insert data in crime collection from the api
     */
    static async seed () {
        let dates = ['2018-11', '2018-12', '2019-01']
        try {
            let properties = await Property.find({}, 'latitude longitude')
            let crimeArray = []
            // await forEach(properties, async (element) =>
            for (let j = 0; j < properties.length; j++) {
                for (let i = 0; i < dates.length; i++) {
                    let option = {
                        uri: 'https://data.police.uk/api/crimes-street/all-crime?lat=' +
                        properties[i].latitude + '&lng=' + properties[i].longitude + '&date=' + dates[i],
                        json: true
                    }
                    // console.log(option.uri)
                    await rp(option)
                        .then(function (repos) {
                            repos.forEach(element => {
                                let crime = {
                                    category: element.category,
                                    latitude: element.location.latitude,
                                    longitude: element.location.longitude,
                                    month: element.month,
                                    crimeId: element.id
                                }
                                crimeArray.push(crime)
                            })
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                }
                await Crime.insertMany(crimeArray)
            }
        } catch (error) {
            ErrorHandler.sendError(error)
        }
    }
}
module.exports = { CrimeSeeder }
