require('express-async-errors')
const express = require('express')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogs')

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use('/api/blogs', blogRouter)

app.get('/health', (req, res) => {
  res.send('ok')
})

module.exports = app
