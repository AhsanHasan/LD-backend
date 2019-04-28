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
     * Get minimum and maximum bedroom number in Property.
     * @example {
     * }
     * @param {*} req
     * @param {*} res
     */
    static async getProprertyBedrooms (req, res) {
        try {
            let minMaxBedrooms = await Property.aggregate([
                { '$group': {
                    '_id': null,
                    'max': { '$max': '$bedroom_number' },
                    'min': { '$min': '$bedroom_number' }
                } }
            ])
            if (minMaxBedrooms.length) {
                return new Response(res, { Bedrooms: minMaxBedrooms }, message.getProprertyBedrooms.success, true)
            } else {
                return new Response(res, { Bedrooms: [] }, message.getProprertyBedrooms.invalid, false, 400)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    /**
     * API | GET
     * Get minimum and maximum prices of Property.
     * @example {
     * }
     * @param {*} req
     * @param {*} res
     */
    static async getProprertyPrices (req, res) {
        try {
            let minMaxPrice = await Property.aggregate([
                { '$group': {
                    '_id': null,
                    'max': { '$max': '$price' },
                    'min': { '$min': '$price' }
                } }
            ])
            if (minMaxPrice.length) {
                return new Response(res, { prices: minMaxPrice }, message.getProprertyPrices.success, true)
            } else {
                return new Response(res, { prices: [] }, message.getProprertyPrices.invalid, false, 400)
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
     *      limit: String,
     *      page: String,
     *      minBedrooms: String,
     *      maxBedrooms: String,
     *      minPrice: String,
     *      maxPrice: String,
     * }
     * @param {*} req
     * @param {*} res
     */
    static async getAllProperties (req, res) {
        try {
            let propertyType = req.query.propertyType
            let postcode = req.query.postcode
            let borough = req.query.borough
            let minBed = req.query.minBed
            let maxBed = req.query.maxBed
            let minPrice = req.query.minPrice
            let maxPrice = req.query.maxPrice
            let limit = req.query.limit
            let page = req.query.page

            let pipeline = []
            if (propertyType !== '' && propertyType != null) {
                pipeline.push({
                    $match: { property_type: propertyType }
                })
            }
            if (postcode !== '' && postcode != null) {
                pipeline.push({
                    $match: { postCode: postcode }
                })
            }
            if (borough !== '' && borough != null) {
                pipeline.push({
                    $match: { borough: borough }
                })
            }
            if (maxBed !== '' && maxBed != null && minBed !== '' && minBed != null && (propertyType === 'flat' || propertyType === 'house')) {
                pipeline.push({
                    $match: { bedroom_number: { $gte: parseInt(minBed), $lte: parseInt(maxBed) } }
                })
            }
            if (maxPrice !== '' && maxPrice != null && minPrice !== '' && minPrice != null) {
                pipeline.push({
                    $match: { price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) } }
                })
            }
            let count = await Property.aggregate(pipeline.concat([
                { $group: { _id: null, count: { $sum: 1 } } }
            ]))
            if (count[0]) { count = count[0].count } else { count = 0 }
            if (
                limit !== '' && limit != null &&
                page !== '' && page != null
            ) {
                pipeline = pipeline.concat([
                    { $skip: page * page - 1 },
                    { $limit: parseInt(limit) }
                ])
            }
            let data = await Property.aggregate(pipeline)
            return new Response(res, {
                properties: data,
                pageNumber: page,
                totalPages: count / limit,
                numberOfRecords: count,
                pageLimit: limit
            })
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    /**
     * API | GET
     * Get barchart formatted data for all crimes by category, month, postcode and borough
     * @example {
     *      propertyType: String,
     *      postCode: String,
     *      borough: String,
     *      minBedrooms: String,
     *      maxBedrooms: String,
     *      minPrice: String,
     *      maxPrice: String,
     * }
     * @param {*} req
     * @param {*} res
     */
    static async getBarchart (req, res) {
        try {
            let propertyType = req.query.propertyType
            let postcode = req.query.postcode
            let borough = req.query.borough
            let minBed = req.query.minBed
            let maxBed = req.query.maxBed
            let minPrice = req.query.minPrice
            let maxPrice = req.query.maxPrice
            let pipeline = []
            if (propertyType !== '' && propertyType != null) {
                pipeline.push({
                    $match: { property_type: propertyType }
                })
            }
            if (postcode !== '' && postcode != null) {
                pipeline.push({
                    $match: { postCode: postcode }
                })
            }
            if (borough !== '' && borough != null) {
                pipeline.push({
                    $match: { borough: borough }
                })
            }
            if (maxBed !== '' && maxBed != null && minBed !== '' && minBed != null && (propertyType === 'flat' || propertyType === 'house')) {
                pipeline.push({
                    $match: { bedroom_number: { $gte: parseInt(minBed), $lte: parseInt(maxBed) } }
                })
            }
            if (maxPrice !== '' && maxPrice != null && minPrice !== '' && minPrice != null) {
                pipeline.push({
                    $match: { price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) } }
                })
            }
            let chartData = await Property.aggregate(pipeline.concat([
                {
                    $group: {
                        _id: '$borough',
                        count: { $avg: '$price' }
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

module.exports = { PropertyController }
