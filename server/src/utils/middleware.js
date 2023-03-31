const { logInfo } = require('./logger');
const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');
const moment = require('moment');
const { User } = require('../models');

const isAdmin = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = jwt.verify(authorization.substring(7), SECRET);
    const user = await User.findByPk(token.id);
    if (!user.admin) {
      return res.status(401).json({ error: 'Operation allowed to Admins only' });
    }
  }
  next();
};

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
      const token = jwt.verify(authorization.substring(7), SECRET);
      req.decodedToken = token;
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

const checkTokenStatus = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = jwt.verify(authorization.substring(7), SECRET);
    const currentTime = moment();
    const timeDifferenceInMinutes = currentTime.diff(moment(token.date), 'minutes');

    const user = await User.findByPk(token.id);

    if (timeDifferenceInMinutes > 60) {
      user.disabled = true;
      await user.save();
      return res.status(401).json({ error: 'Token has expired' });
    }

    if (user.disabled) {
      return res.json({ error: 'You must login to do this' });
    }
  }
  next();
};

module.exports = {
  isAdmin,
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  checkTokenStatus,
};
