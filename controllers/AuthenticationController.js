'use strict'

const { User } = require('./../schema/user')
const { Response } = require('./../utils/Response')
const { ErrorHandler } = require('./../utils/ErrorHandler')
const { AuthMiddleware } = require('./../middleware/AuthMiddleware')
const bcrypt = require('bcryptjs')
const message = require('./../utils/message')

class AuthenticationController {
    /**
     * API | POST
     * Create a new user and send authentication token
     * @example {
     *      email: String,
     *      password: String,
     *      firstName: String,
     *      lastName: String
     * }
     * @param {*} req
     * @param {*} res
     */
    static async signup (req, res) {
        try {
            let email = req.body.email
            let password = req.body.password
            let firstName = req.body.firstName
            let lastName = req.body.lastName
            password = bcrypt.hashSync(password, 8)
            const user = new User({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            })
            await user.save()
            const token = AuthMiddleware.createJWT(user)
            await User.findOneAndUpdate({ _id: user._id }, { $set: { authToken: token } })
            return new Response(res, { token: token }, message.signup.success)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    /**
     * API | POST
     * Login the registered user and send authentication token
     * @example {
     *      email: String,
     *      password: String
     * }
     * @param {*} req
     * @param {*} res
     */
    static async login (req, res) {
        try {
            let email = req.body.email
            let password = req.body.password
            // Login work here
            var loginSuccesss = 1 // login successful or unsuccessful
            if (loginSuccesss) {
                const token = '12345678' // Token from middleware here
                return new Response(res, { token: token }, message.login.success, true)
            } else if (loginSuccesss) {
                return new Response(res, { token: '' }, message.login.invalidEmail, false)
            } else {
                return new Response(res, { token: '' }, message.login.invalidPassword, false)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { AuthenticationController }
