const User = require('./models/userModel')
const Coin = require('./models/coinModel')
const connectDB = require('./config/db')
const userData = require('./data/users')
const coinData = require('./data/coins')

connectDB()

// @desc    Populate data into database
// @cmd     npm run data:insert
const insertData = async () => {
    try {
        await User.deleteMany()
        await Coin.deleteMany()

        await User.insertMany(userData)
        await Coin.insertMany(coinData)

        console.log('Data inserted to database')
        process.exit()
    } catch (error) {
        console.error(`Error: ${error}`)
        process.exit(1)
    }
}

insertData()