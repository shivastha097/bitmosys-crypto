const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    numCoinType: {
        type: Number,
        default: 0
    },
    numCoinCount: {
        type: Number,
        default: 0
    },
    coinItems: [
        {
            name: {
                type: String,
                required: true
            },
            image: {
                type: String
            },
            quantity: {
                type: Number,
                required: true
            },
            coin: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Coin'
            }
        }
    ]
})

const User = mongoose.model('User', userSchema)

module.exports = User