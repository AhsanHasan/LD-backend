'use strict'

const { Property } = require('./../schema/property')
const { Response } = require('./../utils/Response')
const { ErrorHandler } = require('./../utils/ErrorHandler')
const message = require('./../utils/message')

class PropertyController {
    /**
     * API | GET
     * Get all the types of properties.
     * @example {
        * }
        * @param {*} req
        * @param {*} res
        */
    static async getPropertyTypes (req, res) {
        try {
            let propertyTypes = await Property.distinct('property_type')
            if (propertyTypes) {
                return new Response(res, { propertyTypes: propertyTypes }, message.getPropertyTypes.success, true)
            } else {
                return new Response(res, { propertyTypes: [] }, message.getPropertyTypes.invalid, false, 400)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    /**
     * API | GET
     * Get all the postCodes of properties.
     * @example {
        * }
        * @param {*} req
        * @param {*} res
        */
    static async getPropertyPostCodes (req, res) {
        try {
            let propertyPostCodes = await Property.distinct('postCode')
            if (propertyPostCodes) {
                return new Response(res, { propertyPostCodes: propertyPostCodes }, message.getPropertyPostCodes.success, true)
            } else {
                return new Response(res, { propertyPostCodes: [] }, message.getPropertyPostCodes.invalid, false, 400)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    /**
     * API | GET
     * Get all boroughs of Property.
     * @example {
        * }
        * @param {*} req
        * @param {*} res
        */
    static async getProprertyBoroughs (req, res) {
        try {
            let PropertyBoroughs = await Property.distinct('borough')
            if (PropertyBoroughs.length) {
                return new Response(res, { PropertyBoroughs: PropertyBoroughs }, message.getProprertyBoroughs.success, true)
            } else {
                return new Response(res, { PropertyBoroughs: [] }, message.getProprertyBoroughs.invalid, false, 400)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    /**
     * API | GET
     * Get all the properties records against propertyType / none.
     * @example {
        *      propertyType: String,
        *      postCode: String,
        *      borough: String,
        *      pageLimit: String,
        *      pageNumber: String
        *      q: String
        * }
        * @param {*} req
        * @param {*} res
        */
    static async getAllProperties (req, res) {
        try {
            let dataRequired = {}
            if (req.query.propertyType) {
                dataRequired['property_type'] = { $in: req.query.propertyType.split(',') }
            }
            if (req.query.postCode) {
                dataRequired['postCode'] = { $in: req.query.postCode.split(',') }
            }
            if (req.query.borough) {
                dataRequired['borough'] = { $in: req.query.borough.split(',') }
            }
            let query = 'title price construction_year car_spaces property_type bathroom_number bedroom_number longitude latitude month postCode borough'
            if (req.query.q) {
                query = req.query.q.replace(/,/g, ' ')
            }
            let results = []
            let pages = 1
            let dataSize = 0
            if (req.query.pageNumber && req.query.pageLimit) {
                results = await Property.find(dataRequired, query).sort({ x: 1 }).skip((parseInt(req.query.pageLimit) - 1) * parseInt(req.query.pageLimit)).limit(parseInt(req.query.pageLimit))
                dataSize = await Property.find(dataRequired, query).sort({ x: 1 }).count()
                pages = Math.ceil(parseInt(dataSize) / parseInt(req.query.pageLimit))
            } else {
                results = await Property.find(dataRequired, query).sort({ x: 1 })
                dataSize = results.length
            }
            if (results.length) {
                if (req.query.pageNumber && req.query.pageLimit) {
                    return new Response(res, { properties: results, pageNumber: req.query.pageNumber, totalPages: pages.toString(), numberOfRecords: dataSize.toString(), pageLimit: req.query.pageLimit }, message.getAllProperties.success, true)
                } else {
                    return new Response(res, { properties: results, pageNumber: '1', totalPages: pages.toString(), numberOfRecords: dataSize.toString(), pageLimit: dataSize.toString() }, message.getAllProperties.success, true)
                }
            } else {
                return new Response(res, { properties: [] }, message.getAllProperties.invalid, false, 400)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { PropertyController }
