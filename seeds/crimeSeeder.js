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
            let crimeArray = []
            for (let j = 0; j < properties.length; j++) {
                crimeArray = []
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
                                    let crime = {
                                        category: element.category,
                                        latitude: element.location.latitude,
                                        longitude: element.location.longitude,
                                        month: element.month,
                                        crimeId: element.id
                                    }
                                    crimeArray.push(crime)
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

    /**
     * Insert postCodes and borough in crime collection from the api
     */
    static async getPostcodesBorough () {
        try {
            console.log('Starting postcode for crime.')
            let crimes = await Crime.find({})
            let dataLength = crimes.length
            console.log('Starting postcode & borough for crime for the data of ' + dataLength + ' entries.')
            for (let x = 0; x < crimes.length; x++) {
                let postCodeCheck = {
                    uri: 'https://api.postcodes.io/outcodes?lon=' + crimes[x].longitude + '&lat=' + crimes[x].latitude,
                    json: true,
                    method: 'GET'
                }
                await rp(postCodeCheck)
                    .then(async (repos) => {
                        console.log('Crime Postcode & Borough: ' + ((x + 1) / dataLength) * 100)
                        await Crime.findOneAndUpdate({ crimeId: crimes[x].crimeId }, { $set: { postCode: repos.result[0].outcode, borough: repos.result[0].admin_district[0] } })
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        } catch (error) {
            ErrorHandler.sendError(error)
        }
    }

    /**
     * Insert borough in crime collection from the api
     */
    static async getBorough () {
        try {
            console.log('Starting borough for crime.')
            let crimes = await Crime.find({ 'borough': { $exists: false } })
            let dataLength = crimes.length
            console.log('Starting borough for crime for the data of ' + dataLength + ' entries.')
            for (let x = 0; x < crimes.length; x++) {
                let postCodeCheck = {
                    uri: 'https://api.postcodes.io/outcodes?lon=' + crimes[x].longitude + '&lat=' + crimes[x].latitude,
                    json: true,
                    method: 'GET'
                }
                await rp(postCodeCheck)
                    .then(async (repos) => {
                        console.log('Crime Borough: ' + ((x + 1) / dataLength) * 100)
                        await Crime.findOneAndUpdate({ crimeId: crimes[x].crimeId }, { $set: { borough: repos.result[0].admin_district[0] } })
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        } catch (error) {
            ErrorHandler.sendError(error)
        }
    }
}
module.exports = { CrimeSeeder }
