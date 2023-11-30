const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')
const accountRoutes = require('./routes/accountRoutes')
const musicRoutes = require('./routes/musicRoutes')
const youtubeRoutes = require('./routes/youtubeRoutes')
const http = require('http')

dotenv.config()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const server = http.createServer(app)

server.listen(3000, () => {
    console.log('server works')
})

//routes
app.use(authRoutes)
app.use(accountRoutes)
app.use(musicRoutes)
app.use(youtubeRoutes)
