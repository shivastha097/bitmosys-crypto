const express = require('express')
const { getCoins, getCoinById } = require('../controllers/coinController')
const router = express.Router()

// Get all cryptocoins
router.get('/', getCoins)

// Get single cryptocoin by id
router.get('/:id', getCoinById)

module.exports = router