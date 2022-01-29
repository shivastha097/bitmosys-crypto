const Coin = require('./../models/coinModel')

// @desc    Get all coins
// @route   GET /cryptocoins
const getCoins = async (req, res) => {
    const coins = await Coin.find({})

    res.json(coins)
}

// @desc    Get cryptocoin by id
// @route   GET /cryptocoins/:id
const getCoinById = async (req, res) => {
    const coin = await Coin.findById(req.params.id)

    res.json(coin)
}

module.exports = {
    getCoins,
    getCoinById
}