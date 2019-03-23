'use strict'

const { Router } = require('express')
const { AuthenticationController } = require('./../controllers/AuthenticationController')

const router = new Router()

// router.post('/login', AuthenticationController.login)
router.post('/signup', AuthenticationController.signup)

module.exports = router
