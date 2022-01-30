const { ObjectId } = require("bson")
const User = require("../models/userModel")
const Coin = require('./../models/coinModel')
const mongoose = require('mongoose')

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
// @route   POST /user/:userId/cryptocoins/:coinId/buy
const buyCryptoCoin = async (req, res) => {
    const userId = req.params.userId
    const coinId = req.params.coinId

    const user = await User.findById(userId)
    const coin = await Coin.findById(coinId)

    if ( coin ) {
        // Check if coin is already purchased
        // res.json(user)
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

// @desc    Exchange cryptocoin
// @route   POST /user/:userId/cryptocoins/:coinId/exchange
const exchangeCryptoCoin = async (req, res) => {
    
    const userId = req.params.userId
    const currentCoinId = req.params.coinId
    const newCoinId = req.body.newCoinId
    const quantity = Number(req.body.quantity)
    
    // Check if similar type of coins are exchanged
    if( currentCoinId !== newCoinId ) {

        const currentCoinData = await Coin.findById(currentCoinId)
        const newCoinData = await Coin.findById(newCoinId)
        const user = await User.findById(userId)

        const currentCoinQuantity = user.coinItems.find(c => c.coin.toString() === currentCoinData._id.toString())
        // res.json(currentCoinQuantity)
        // check the available coin's quantity 
        if ( (quantity <= newCoinData.quantity) && (quantity <= currentCoinQuantity.quantity) ) {
            
            const existingCoin = user.coinItems.find(c => c.coin.toString() === newCoinData._id.toString())
            
            // check if new coin is already exists - TRUE
            if ( existingCoin ) {
                // res.json('coin already exists')
                existingCoin.quantity += quantity

                // update coin quantity in User model
                const myCurrentCoin = user.coinItems.find(c => c.coin.toString() === currentCoinData._id.toString())
                myCurrentCoin.quantity -= quantity
                await user.save()

                // update coins quantity in Coin model
                newCoinData.quantity -= quantity
                currentCoinData.quantity += quantity
                
                await newCoinData.save()
                await currentCoinData.save()

                res.json('Coins successfully exchanged')
            } else {
                // if the new coin (coin to be exchanged) doesn't exist in user profile
                const myCurrentCoin = await user.coinItems.find(c => c.coin.toString() === currentCoinData._id.toString())
                const postCoinQuantity = myCurrentCoin.quantity - quantity

                // res.json('New coin to exchange')
                const newExchangedCoin = {
                    name: newCoinData.name,
                    image: newCoinData.image,
                    quantity: quantity,
                    coin: newCoinData._id
                }
                
                // Remove current coin from profile if quantity is 0
                if ( postCoinQuantity == 0 ) {
                    const items = user.coinItems.splice(user.coinItems.findIndex(c => c.coin.toString() === currentCoinId.toString()), 1)
                    user.coinItems.push(newExchangedCoin)
                    
                    await user.save()
                } else {
                    user.coinItems.push(newExchangedCoin)
                    user.numCoinType += 1

                    myCurrentCoin.quantity -= quantity
                    await user.save()
                    await myCurrentCoin.save()
                }

                // update coins quantity in Coin Model
                currentCoinData.quantity += quantity
                newCoinData.quantity -= quantity
                await currentCoinData.save()
                await newCoinData.save()

                res.json('Coins successfully exchanged')
            }
        } else {
            res.json('Maximum quantity entered')
        }
    } else {
        res.json('Sorry, same type of coin cannot be exchanged')
    }
}

module.exports = {
    getUsers,
    getUserById,
    buyCryptoCoin,
    exchangeCryptoCoin
}