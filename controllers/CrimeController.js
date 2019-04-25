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
        *      size: String,
        *      pageLimit: String,
        *      pageNumber: String,
        *      q: String
        * }
        * @param {*} req
        * @param {*} res
        */
    static async getAllCrimes (req, res) {
        try {
            let dataRequired = {}
            if (req.query.category) {
                dataRequired['category'] = { $in: req.query.category.split(',') }
            }
            if (req.query.month) {
                dataRequired['month'] = { $in: req.query.month.split(',') }
            }
            if (req.query.postCode) {
                dataRequired['postCode'] = { $in: req.query.postCode.split(',') }
            }
            if (req.query.borough) {
                dataRequired['borough'] = { $in: req.query.borough.split(',') }
            }
            let query = 'category longitude latitude month postCode borough'
            if (req.query.q) {
                query = req.query.q.replace(/,/g, ' ')
            }
            let results = []
            let pages = 1
            let dataSize = 0
            if (req.query.pageNumber && req.query.pageLimit) {
                results = await Crime.find(dataRequired, query).sort({ x: 1 }).skip((parseInt(req.query.pageNumber) - 1) * parseInt(req.query.pageLimit)).limit(parseInt(req.query.pageLimit))
                dataSize = await Crime.find(dataRequired, query).sort({ x: 1 }).count()
                pages = Math.ceil(parseInt(dataSize) / parseInt(req.query.pageLimit))
            } else {
                results = await Crime.find(dataRequired, query).sort({ x: 1 })
                dataSize = results.length
            }
            if (results.length) {
                if (req.query.pageNumber && req.query.pageLimit) {
                    return new Response(res, { crimes: results, pageNumber: req.query.pageNumber, totalPages: pages.toString(), numberOfRecords: dataSize.toString(), pageLimit: req.query.pageLimit }, message.getAllCrimes.success, true)
                } else {
                    return new Response(res, { crimes: results, pageNumber: 1, totalPages: pages.toString(), numberOfRecords: dataSize.toString(), pageLimit: dataSize.toString() }, message.getAllCrimes.success, true)
                }
            } else {
                return new Response(res, { crimes: [] }, message.getAllCrimes.invalid, false, 400)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { CrimeController }
