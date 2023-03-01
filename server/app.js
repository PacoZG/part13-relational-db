require('express-async-errors')
const express = require('express')
const blogRouter = require('./controllers/blogs')
const { requestLogger, errorHandler, unknownEndpoint } = require('./utils/middleware')

const app = express()

app.use(express.json())

app.use(requestLogger)

app.use(express.static('build'))

app.use('/api/blogs', blogRouter)

app.get('/health', (req, res) => {
  res.send('ok')
})

app.use(errorHandler)
app.use(unknownEndpoint)

module.exports = app
