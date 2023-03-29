const http = require('http');
const app = require('./app');
const { PORT } = require('./utils/config');
const { connectToDatabase } = require('./utils/db');
const { logInfo } = require('./utils/logger');

const server = http.createServer(app);

server.listen(PORT, () => {
  connectToDatabase();
  logInfo(`Server started on port ${PORT}`);
});
