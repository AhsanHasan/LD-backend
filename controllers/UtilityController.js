'use strict'

const config = require('./../config')
const message = require('./../utils/message')
const { Response } = require('./../utils/Response')
const { ErrorHandler } = require('./../utils/ErrorHandler')

class UtilityController {
    /**
     * API | GET
     * Get the version of the server build.
     * @param {*} req
     * @param {*} res
     */
    static getVersion (req, res) {
        try {
            return new Response(res, { version: config.VERSION }, message.version.success)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { UtilityController }
