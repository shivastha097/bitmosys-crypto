const express = require('express')
const { getUsers, getUserById, buyCryptoCoin } = require('../controllers/userController')
const router = express.Router()

// List all users
router.get('/', getUsers)

// Get user by id
router.get('/:id', getUserById)

// Buy cryptocoin by user
router.post('/:userId/cryptocoins/:coinId/buy', buyCryptoCoin)

module.exports = router