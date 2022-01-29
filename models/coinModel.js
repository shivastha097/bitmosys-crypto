const mongoose = require("mongoose")

const coinSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    }
})

const Coin = mongoose.model('Coin', coinSchema)

module.exports = Coin