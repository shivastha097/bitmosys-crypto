const User = require("../models/userModel")
const Coin = require('./../models/coinModel')

// @desc    Get users
// @route   GET /user
const getUsers = async (req, res) => {
    const users = await User.find({})

    res.json(users)
}

// @desc    Get user by id
// @route   GET /user/:id
const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id)

    res.json(user)
}

// @desc    Buy cryptocoin by user
// @route   POST /user/:userId/cryptocoins/:cryptoId/buy
const buyCryptoCoin = async (req, res) => {
    const userId = req.params.userId
    const coinId = req.params.coinId

    const user = await User.findById(userId)
    const coin = await Coin.findById(coinId)

    if ( coin ) {
        // Check if coin is already purchased
        const purchasedCoin = user.coinItems.find(c => c.coin.toString() === coin._id.toString())
        
        const purchasedQuantity = Number(req.body.quantity)

        if ( purchasedQuantity <= coin.quantity ) {

            if ( purchasedCoin ) {
                
                const updateCoin = user.coinItems.find(c => c.coin.toString() === coin._id.toString())
                updateCoin.quantity += purchasedQuantity

                user.numCoinCount += purchasedQuantity

                const updateSuccess = await user.save()

                if ( updateSuccess ) {
                    coin.quantity -= purchasedQuantity
                    await coin.save()
                }
                res.json('Profile successfully updated')

            } else {
                // Add new coin to profile
                const newPurchasedCoin = {
                    name: coin.name,
                    image: coin.image,
                    quantity: purchasedQuantity,
                    coin: coin._id
                }

                user.coinItems.push(newPurchasedCoin)

                user.numCoinType += 1
                user.numCoinCount += purchasedQuantity

                const saveSuccess = await user.save()

                if ( saveSuccess ) {
                    coin.quantity -= purchasedQuantity
                    await coin.save()
                }

                res.status(201).json('Coin added to profile')
            }
        } else {
            res.json('Insufficient coins to proceed your request')
        }
        
    } else {
        res.status(404).json('Coin not found')
    }
}

module.exports = {
    getUsers,
    getUserById,
    buyCryptoCoin
}