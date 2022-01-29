const express = require("express")
const connectDB = require("./config/db")
const bodyParser = require('body-parser')
const userRoutes = require('./routes/userRoutes')
const coinRoutes = require('./routes/coinRoutes')

const PORT = 5000

const app = express()
connectDB()

// Initialize body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Routes
app.get('/', (req, res) => {
    res.json('Application is running...')
})
app.use('/user', userRoutes)
app.use('/cryptocoins', coinRoutes)

// Run server on PORT 5000
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})