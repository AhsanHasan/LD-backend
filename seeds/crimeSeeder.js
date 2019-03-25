const { ErrorHandler } = require('./../utils/ErrorHandler')
const { Property } = require('./../schema/property')
const { Crime } = require('./../schema/crime')
const rp = require('request-promise')
const url = require('./../utils/url')

class CrimeSeeder {
    /**
     * Insert data in crime collection from the api
     */
    static async seed () {
        let dates = ['2017-01', '2017-02', '2017-03', '2017-04', '2017-05', '2017-06', '2017-07', '2017-08', '2017-09', '2017-10', '2017-11', '2017-12', '2018-01', '2018-02', '2018-03', '2018-04', '2018-05', '2018-06', '2018-07', '2018-08', '2018-09', '2018-10', '2018-11', '2018-12', '2019-01']
        let option = {
            uri: 'https://data.police.uk/api/crimes-street/all-crime?lat=51.5492&lng=-0.172361&date=2017-02',
            json: true
        }
        try {
            let properties = await Property.find({})
            console.log(properties)
            await rp(option)
                .then(function (repos) {
                    console.log(repos)
                })
                .catch(function (err) {
                    console.log(err)
                })
        } catch (error) {
            ErrorHandler.sendError(error)
        }
    }
}
module.exports = { CrimeSeeder }
