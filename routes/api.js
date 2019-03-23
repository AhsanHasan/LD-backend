'use strict'

const { Router } = require('express')
const { AuthenticationController } = require('./../controllers/AuthenticationController')
const { UtilityController } = require('./../controllers/UtilityController')

const router = new Router()

// router.post('/login', AuthenticationController.login)
router.post('/signup', AuthenticationController.signup)
router.get('/get-version', UtilityController.getVersion)

module.exports = router
