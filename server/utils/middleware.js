const logger = require('./logger')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('----------------------------------------------------------')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown Endpoint' })
}

const errorHandler = (error, req, res, next) => {
  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).send({
      error: 'Invalid id'
    })
  } else if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: error.message
    })
  } 
  
  logger.error(error.message)
  next(error)
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }