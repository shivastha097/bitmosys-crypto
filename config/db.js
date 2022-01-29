const mongoose = require("mongoose")

// @desc    Database connection method
const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb://localhost:27017/bitmosys", {
            useNewUrlParser: true
        })

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error: ${error.message}`)

        process.exit(1)
    }
}

module.exports = connectDB