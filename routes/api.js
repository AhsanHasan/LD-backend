'use strict'

const { Router } = require('express')
const { AuthenticationController } = require('./../controllers/AuthenticationController')
const { UtilityController } = require('./../controllers/UtilityController')
const { PropertyController } = require('./../controllers/PropertyController')
const { CrimeController } = require('./../controllers/CrimeController')

const router = new Router()
// Authentication API
router.post('/login', AuthenticationController.login)
router.post('/signup', AuthenticationController.signup)
router.get('/get-version', UtilityController.getVersion)
router.get('/check-auth', AuthenticationController.checkLogin)
router.get('/get-profile', AuthenticationController.getProfile)
// Properties API
router.get('/get-property-types', PropertyController.getPropertyTypes)
// Crime API
router.get('/get-crime-categories', CrimeController.getCrimeCategories)
router.get('/get-crime-months', CrimeController.getCrimeMonths)
router.get('/get-all-crimes', CrimeController.getAllCrimes)

module.exports = router
