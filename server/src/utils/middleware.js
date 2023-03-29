const { logInfo } = require('./logger');
const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');

const requestLogger = (req, _ree, next) => {
  logInfo('Method:', req.method);
  logInfo('Path:  ', req.path);
  logInfo('Body:  ', req.body);
  logInfo('----------------------------------------------------------');
  next();
};

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'Unknown Endpoint' });
};

const errorHandler = (error, _req, res, next) => {
  console.log('ERROR, PUTO ERROR: ', error);
  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).send({
      error: error.errors[0].message,
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).send({
      error: error.errors[0].message,
    });
  }

  if (error) {
    return res.status(400).send({
      error: error.errors[0].message,
    });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

module.exports = { requestLogger, unknownEndpoint, errorHandler, tokenExtractor };
