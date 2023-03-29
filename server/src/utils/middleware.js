const { logInfo } = require('./logger');

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

module.exports = { requestLogger, unknownEndpoint, errorHandler };
