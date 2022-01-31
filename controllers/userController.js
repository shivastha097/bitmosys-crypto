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

    if ( user ) {
        res.json(user)
    } else {
        res.status(404).json('User not found')
    }
}

// @desc    Buy cryptocoin by user
// @route   POST /user/:userId/cryptocoins/:coinId/buy
const buyCryptoCoin = async (req, res) => {
    const userId = req.params.userId
    const coinId = req.params.coinId

    const user = await User.findById(userId)
    const coin = await Coin.findById(coinId)

    // check if user exists
    if ( user ) {
        // Check if coin exists
        if ( coin ) {
            // Check if coin is already purchased
        
            const purchasedCoin = user.coinItems.find(c => c.coin.toString() === coin._id.toString())
            const purchasedQuantity = Number(req.body.quantity)

            // Check the entered quantity with coin quantity
            if ( purchasedQuantity <= coin.quantity ) {

                // Check if coin already exists in profile
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
                // if quantity is maximum - ELSE
                res.json('Insufficient coins to proceed your request')
            }
        
        } else {
            // if coin not found
            res.status(404).json('Coin not found')
        }
    } else {
        // if user not found
        res.status(404).json('User not found')
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

        // Check if user exists
        if ( user ) {
            const currentCoinQuantity = user.coinItems.find(c => c.coin.toString() === currentCoinData._id.toString())
            
            // check the available coin's quantity 
            if ( (quantity <= newCoinData.quantity) && (quantity <= currentCoinQuantity.quantity) ) {
            
                const existingCoin = user.coinItems.find(c => c.coin.toString() === newCoinData._id.toString())
            
                // check if new coin is already exists - TRUE
                if ( existingCoin ) {
                    existingCoin.quantity += quantity

                    // update coin quantity in User model
                    const myCurrentCoin = user.coinItems.find(c => c.coin.toString() === currentCoinData._id.toString())
                    myCurrentCoin.quantity -= quantity

                    if( myCurrentCoin.quantity === 0 ) {
                        user.coinItems.splice(user.coinItems.findIndex(c => c.coin.toString() === currentCoinId.toString()), 1)
                        user.numCoinType -= 1
                    }
                    await user.save()

                    // update coins quantity in Coin model
                    newCoinData.quantity -= quantity
                    currentCoinData.quantity += quantity
                
                    await newCoinData.save()
                    await currentCoinData.save()

                    res.status(201).json('Coins successfully exchanged')
                } else {
                    // if the new coin (coin to be exchanged) doesn't exist in user profile
                    const myCurrentCoin = await user.coinItems.find(c => c.coin.toString() === currentCoinData._id.toString())
                    const postCoinQuantity = myCurrentCoin.quantity - quantity

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
                        // Check if postCoin quantity is not 0 - ELSE
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

                    res.status(201).json('Coins successfully exchanged')
                }
            } else {
                // Check if maximum quantity is entered - ELSE
                res.json('Maximum quantity entered')
            }
        } else {
            // check if user exists - ELSE
            res.status(404).json('User not found')
        }
    } else { 
        // Check if similar type of coins are exchanged - ELSE
        res.json('Sorry, same type of coin cannot be exchanged')
    }
}

module.exports = {
    getUsers,
    getUserById,
    buyCryptoCoin,
    exchangeCryptoCoin
}