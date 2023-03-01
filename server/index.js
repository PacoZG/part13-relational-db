const app = require('./app')
const http = require('http')

const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const { info } = require('./utils/logger')

const server = http.createServer(app)

server.listen(PORT, () => {
  connectToDatabase()
  info(`Server started on port ${PORT}`)
})