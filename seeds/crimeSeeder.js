const { ErrorHandler } = require('./../utils/ErrorHandler')
const { Property } = require('./../schema/property')
const { Crime } = require('./../schema/crime')
const rp = require('request-promise')

class CrimeSeeder {
    /**
     * Insert data in crime collection from the api
     */
    static async seed () {
        let dates = ['2017-01', '2017-02', '2017-03', '2017-04', '2017-05', '2017-06', '2017-07', '2017-08', '2017-09', '2017-10', '2017-11', '2017-12', '2018-01', '2018-02', '2018-03', '2018-04', '2018-05', '2018-06', '2018-07', '2018-08', '2018-09', '2018-10', '2018-11', '2018-12', '2019-01']
        try {
            let properties = await Property.find({}, 'latitude longitude')
            for (let j = 0; j < properties.length; j++) {
                let crimeArray = []
                for (let i = 0; i < dates.length; i++) {
                    let option = {
                        uri: 'https://data.police.uk/api/crimes-street/all-crime?lat=' +
                        properties[i].latitude + '&lng=' + properties[i].longitude + '&date=' + dates[i],
                        json: true
                    }
                    await rp(option)
                        .then(function (repos) {
                            repos.forEach(async (element) => {
                                let checkEntry = await Crime.findOne({ crimeId: element.id })
                                if (!checkEntry) {
                                    let postCodeCheck = {
                                        url: 'https://api.postcodes.io/outcodes?lon=' + element.location.longitude + '&lat=' + element.location.latitude,
                                        json: true
                                    }
                                    await rp(postCodeCheck)
                                        .then(function (postal) {
                                            let crime = {
                                                category: element.category,
                                                latitude: element.location.latitude,
                                                longitude: element.location.longitude,
                                                month: element.month,
                                                crimeId: element.id,
                                                postCode: postal.result[0].outcode
                                            }
                                            crimeArray.push(crime)
                                        })
                                        .catch(function (err) {
                                            console.log(err)
                                            let crime = {
                                                category: element.category,
                                                latitude: element.location.latitude,
                                                longitude: element.location.longitude,
                                                month: element.month,
                                                crimeId: element.id,
                                                postCode: ''
                                            }
                                            crimeArray.push(crime)
                                        })
                                }
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
