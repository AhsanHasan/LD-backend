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
     * Get all the properties records against propertyType / none.
     * @example {
        *      propertyType: String
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
            let results = await Property.find(dataRequired)
            if (results.length) {
                return new Response(res, { properties: results }, message.getAllProperties.success, true)
            } else {
                return new Response(res, { properties: [] }, message.getAllProperties.invalid, false, 400)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { PropertyController }
