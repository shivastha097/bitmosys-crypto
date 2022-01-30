const express = require('express')
const { getUsers, getUserById, buyCryptoCoin, exchangeCryptoCoin } = require('../controllers/userController')
const router = express.Router()

// List all users
router.get('/', getUsers)

// Get user by id
router.get('/:id', getUserById)

// Buy cryptocoin by user
router.post('/:userId/cryptocoins/:coinId/buy', buyCryptoCoin)

// Exchange cryptocoin
router.post('/:userId/cryptocoins/:coinId/exchange', exchangeCryptoCoin)

module.exports = router