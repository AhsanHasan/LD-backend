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
router.get('/property/types', PropertyController.getPropertyTypes)
router.get('/property/postcodes', PropertyController.getPropertyPostCodes)
router.get('/property/bedrooms', PropertyController.getProprertyBedrooms)
router.get('/property/prices', PropertyController.getProprertyPrices)
router.get('/property/boroughs', PropertyController.getProprertyBoroughs)
router.get('/property/all', PropertyController.getAllProperties)
router.get('/property/bar-chart', PropertyController.getBarchart)
// Crime API
router.get('/get-crime-categories', CrimeController.getCrimeCategories)
router.get('/get-crime-months', CrimeController.getCrimeMonths)
router.get('/get-crime-postcodes', CrimeController.getCrimePostCodes)
router.get('/get-crime-boroughs', CrimeController.getCrimeBoroughs)
router.get('/get-all-crimes', CrimeController.getAllCrimes)
router.get('/crime-data/bar-chart', CrimeController.getBarchart)

module.exports = router
