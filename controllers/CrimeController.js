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
            if (categories) {
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
            if (months) {
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
            if (months) {
                return new Response(res, { months: months }, message.getCrimePostCodes.success, true)
            } else {
                return new Response(res, { months: [] }, message.getCrimePostCodes.invalid, false, 400)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    /**
     * API | GET
     * Get all the Crime of records against a catagory / month / postcode / borough / any combination / none.
     * @example {
        *      category: String,
        *      month: String,
        *      postCode: String,
        *      borough: String
        * }
        * @param {*} req
        * @param {*} res
        */
    static async getAllCrimes (req, res) {
        try {
            let results = []
            let query = 'category longitude latitude month postCode borough'
            if (req.query.category && !req.query.month && !req.query.postCode && !req.query.borough) {
                results = await Crime.find({ 'category': req.query.category }, query)
            } else if (!req.query.category && req.query.month && !req.query.postCode && !req.query.borough) {
                results = await Crime.find({ 'month': req.query.month }, query)
            } else if (!req.query.category && !req.query.month && req.query.postCode && !req.query.borough) {
                results = await Crime.find({ 'postCode': req.query.postCode }, query)
            } else if (!req.query.category && !req.query.month && !req.query.postCode && req.query.borough) {
                results = await Crime.find({ 'borough': req.query.borough }, query)
            } else if (req.query.category && req.query.month && !req.query.postCode && !req.query.borough) {
                results = await Crime.find({ 'month': req.query.month, 'category': req.query.category }, query)
            } else if (!req.query.category && req.query.month && req.query.postCode && !req.query.borough) {
                results = await Crime.find({ 'month': req.query.month, 'postCode': req.query.postCode }, query)
            } else if (!req.query.category && req.query.month && !req.query.postCode && req.query.borough) {
                results = await Crime.find({ 'month': req.query.month, 'borough': req.query.borough }, query)
            } else if (req.query.category && req.query.month && req.query.postCode && !req.query.borough) {
                results = await Crime.find({ 'month': req.query.month, 'category': req.query.category, 'postCode': req.query.postCode }, query)
            } else if (req.query.category && req.query.month && !req.query.postCode && req.query.borough) {
                results = await Crime.find({ 'month': req.query.month, 'category': req.query.category, 'borough': req.query.borough }, query)
            } else if (!req.query.category && req.query.month && req.query.postCode && req.query.borough) {
                results = await Crime.find({ 'month': req.query.month, 'postCode': req.query.postCode, 'borough': req.query.borough }, query)
            } else if (req.query.category && req.query.month && req.query.postCode && req.query.borough) {
                results = await Crime.find({ 'month': req.query.month, 'category': req.query.category, 'postCode': req.query.postCode, 'borough': req.query.borough }, query)
            } else if (req.query.category && !req.query.month && req.query.postCode && !req.query.borough) {
                results = await Crime.find({ 'category': req.query.category, 'postCode': req.query.postCode }, query)
            } else if (req.query.category && !req.query.month && !req.query.postCode && req.query.borough) {
                results = await Crime.find({ 'category': req.query.category, 'borough': req.query.borough }, query)
            } else if (req.query.category && !req.query.month && req.query.postCode && req.query.borough) {
                results = await Crime.find({ 'category': req.query.category, 'postCode': req.query.postCode, 'borough': req.query.borough }, query)
            } else if (!req.query.category && !req.query.month && req.query.postCode && req.query.borough) {
                results = await Crime.find({ 'postCode': req.query.postCode, 'borough': req.query.borough }, query)
            } else {
                results = await Crime.find({}, query)
            }
            if (results.length) {
                return new Response(res, { crimes: results }, message.getAllCrimes.success, true)
            } else {
                return new Response(res, { crimes: [] }, message.getAllCrimes.invalid, false, 400)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { CrimeController }
