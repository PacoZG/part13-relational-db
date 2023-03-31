const bcrypt = require('bcrypt');
const Router = require('express').Router;
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../utils/config');
const moment = require('moment');

const loginRouter = Router();

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user?.dataValues.password_hash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid username or password',
    });
  }

  const userForToken = {
    username: user?.dataValues.username,
    id: user?.dataValues.id,
    date: moment().format(),
  };

  user.disabled = false;
  await user.save();
  const token = jwt.sign(userForToken, SECRET);

  res.status(200).send({ token, username: user?.dataValues.username });
});

module.exports = loginRouter;
