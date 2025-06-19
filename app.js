const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.urlencoded({ extended: true }))
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blog')


mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDBAtlas')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use((request,response, next) => {
  logger.info('Middleware global, request.body:', request.body)
  next()
})


app.use(middleware.requestLogger)

app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app