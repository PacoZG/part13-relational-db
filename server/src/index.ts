import * as http from 'http'
import { app } from './app'
import { PORT } from "./utils/config"
import { connectToDatabase } from "./utils/db"
import { logInfo } from "./utils/logger"


const server = http.createServer(app)

server.listen(PORT, () => {
  connectToDatabase()
  logInfo (`Server started on port ${PORT}`)
})