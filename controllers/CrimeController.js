'use strict'

const { Crime } = require('./../schema/crime')
const { Response } = require('./../utils/Response')
const { ErrorHandler } = require('./../utils/ErrorHandler')
const message = require('./../utils/message')

class CrimeController {
    /**
     * API | GET
     * Get all the categories of crimes.
     * @example {
        * }
        * @param {*} req
        * @param {*} res
        */
    static async getCrimeCategories (req, res) {
        try {
            let categories = await Crime.distinct('category')
            if (categories.length) {
                return new Response(res, { categories: categories }, message.getCrimeCategories.success, true)
            } else {
                return new Response(res, { categories: [] }, message.getCrimeCategories.invalid, false, 400)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    /**
     * API | GET
     * Get all the categories of crimes.
     * @example {
        * }
        * @param {*} req
        * @param {*} res
        */
    static async getCrimeMonths (req, res) {
        try {
            let months = await Crime.distinct('month')
            if (months.length) {
                return new Response(res, { months: months }, message.getCrimeMonths.success, true)
            } else {
                return new Response(res, { months: [] }, message.getCrimeMonths.invalid, false, 400)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    /**
     * API | GET
     * Get all postCodes of crimes.
     * @example {
        * }
        * @param {*} req
        * @param {*} res
        */
    static async getCrimePostCodes (req, res) {
        try {
            let months = await Crime.distinct('postCode')
            if (months.length) {
                return new Response(res, { postCodes: months }, message.getCrimePostCodes.success, true)
            } else {
                return new Response(res, { postCodes: [] }, message.getCrimePostCodes.invalid, false, 400)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    /**
     * API | GET
     * Get all boroughs of crimes.
     * @example {
        * }
        * @param {*} req
        * @param {*} res
        */
    static async getCrimeBoroughs (req, res) {
        try {
            let boroughs = await Crime.distinct('borough')
            if (boroughs.length) {
                return new Response(res, { boroughs: boroughs }, message.getCrimeBoroughs.success, true)
            } else {
                return new Response(res, { boroughs: [] }, message.getCrimeBoroughs.invalid, false, 400)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    /**
     * API | GET
     * Get all the Crime of records against a catagory / month / postcode / borough / any combination / none, with all or just required variables.
     * @example {
        *      category: String,
        *      month: String,
        *      postCode: String,
        *      borough: String,
        *      pageLimit: String,
        *      pageNumber: String,
        *      q: String
        * }
        * @param {*} req
        * @param {*} res
        */
    static async getAllCrimes (req, res) {
        try {
            let category = req.query.category
            let month = req.query.month
            let postCode = req.query.postcode
            let borough = req.query.borough
            let pageLimit = req.query.pageLimit
            let pageNumber = req.query.pageNumber
            let pipeline = []
            if (category !== '' && category != null) {
                pipeline.push({
                    $match: { category: category }
                })
            }
            if (month !== '' && month != null) {
                pipeline.push({
                    $match: { month: month }
                })
            }
            if (postCode !== '' && postCode != null) {
                pipeline.push({
                    $match: { postCode: postCode }
                })
            }
            if (borough !== '' && borough != null) {
                pipeline.push({
                    $match: { borough: borough }
                })
            }
            let count = await Crime.aggregate(pipeline.concat([
                { $group: { _id: null, count: { $sum: 1 } } }
            ]))
            if (count[0]) { count = count[0].count } else { count = 0 }
            if (
                pageLimit !== '' && pageLimit != null &&
                pageNumber !== '' && pageNumber != null
            ) {
                pipeline = pipeline.concat([
                    { $skip: pageLimit * pageNumber - 1 },
                    { $limit: parseInt(pageLimit) }
                ])
            }
            let data = await Crime.aggregate(pipeline)
            return new Response(res, {
                crimes: data,
                pageNumber: pageNumber,
                totalPages: count / pageLimit,
                numberOfRecords: count,
                pageLimit: pageLimit
            })
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    /**
     * API | GET
     * Get barchart formatted data for all crimes by category, month, postcode and borough
     * @example {
     *      category: String,
     *      month: String,
     *      postCode: String,
     *      borough: String
     * }
     * @param {*} req
     * @param {*} res
     */
    static async getBarchart (req, res) {
        try {
            let category = req.query.category
            let month = req.query.month
            let postCode = req.query.postcode
            let borough = req.query.borough
            let pipeline = []
            if (category !== '' && category != null) {
                pipeline.push({
                    $match: { category: category }
                })
            }
            if (month !== '' && month != null) {
                pipeline.push({
                    $match: { month: month }
                })
            }
            if (postCode !== '' && postCode != null) {
                pipeline.push({
                    $match: { postCode: postCode }
                })
            }
            if (borough !== '' && borough != null) {
                pipeline.push({
                    $match: { borough: borough }
                })
            }
            let chartData = await Crime.aggregate(pipeline.concat([
                {
                    $group: {
                        _id: '$borough',
                        count: { $sum: 1 }
                    }
                }
            ]))
            chartData = chartData.map(x => {
                return {
                    x: x._id,
                    y: x.count
                }
            })
            return new Response(res, { chartData: chartData })
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { CrimeController }
