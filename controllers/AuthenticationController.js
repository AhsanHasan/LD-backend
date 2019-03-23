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
            let checkUser = await User.findOne({ email: email })
            if (checkUser) {
                return new Response(res, { token: '' }, message.signup.invalidEmail, false, 400)
            } else {
                const user = new User({
                    email: email,
                    password: bcrypt.hashSync(req.body.password, 8),
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                })
                await user.save()
                const token = AuthMiddleware.createJWT(user)
                await User.findOneAndUpdate({ _id: user._id }, { $set: { authToken: token } })
                return new Response(res, { token: token }, message.signup.success, true)
            }
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
            let checkUser = await User.findOne({ email: email })
            if (!checkUser) {
                return new Response(res, { token: '' }, message.login.invalidEmail, false, 400)
            } else {
                if (!bcrypt.compareSync(password, checkUser.password)) {
                    return new Response(res, { token: '' }, message.login.invalidPassword, false, 400)
                } else {
                    let token = AuthMiddleware.createJWT(checkUser)
                    await User.findOneAndUpdate({ email: email }, { $set: { authToken: token } })
                    return new Response(res, { token: token }, message.login.success, true)
                }
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    /**
     * API | GET
     * Check if the authentication token is still valid.
     * @example {
        *      token: String
        * }
        * @param {*} req
        * @param {*} res
        */
    static async checkLogin (req, res) {
        try {
            let token = req.query.token
            let user = await User.findOne({ token: token })
            if (user == null) {
                return new Response(res, { authenticated: false }, message.checkLogin.invalid, false, 401)
            } else {
                return new Response(res, { authenticated: true }, message.checkLogin.success)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    /**
     * API | GET
     * Get user profile against the token.
     * @example {
        *      token: String
        * }
        * @param {*} req
        * @param {*} res
        */
    static async getProfile (req, res) {
        try {
            let token = req.query.token
            let user = await User.findOne({ token: token })
            if (user == null) {
                return new Response(res, { user: {} }, message.getProfile.invalid, false, 401)
            } else {
                return new Response(res, { user }, message.getProfile.success)
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { AuthenticationController }
