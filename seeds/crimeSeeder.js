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
        let dates = ['2018-10', '2018-11', '2018-07', '2017-04', '2017-05', '2017-06', '2017-07', '2017-08', '2017-09', '2017-10', '2017-11', '2017-12', '2018-01', '2018-02', '2018-03', '2018-04', '2018-05', '2018-06']
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
