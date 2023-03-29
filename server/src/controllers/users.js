const bcrypt = require('bcrypt');
const Router = require('express').Router;
const { Blog, User } = require('../models');
const { SECRET } = require('../utils/config');

const jwt = require('jsonwebtoken');

const userRouter = Router();

userRouter.get('/', async (_req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
    attributes: { exclude: ['password_hash'] },
  });
  res.json(users);
});

userRouter.post('/', async (req, res) => {
  const { name, username, password } = req.body;

  if (!password) {
    return res.status(403).json({ message: 'Password needs to be provided' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const newUser = {
    name,
    username,
    password_hash: passwordHash,
  };

  const user = await User.create(newUser);

  const userForToken = {
    id: user.dataValues.id,
    username: user.dataValues.username,
  };

  const token = jwt.sign(userForToken, SECRET);
  res.status(201).json({ username: user.dataValues.username, token });
});

userRouter.get('/:username', async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.status(200).json(user);
});

userRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  await user?.destroy();
  res.status(200).json({ message: 'User deleted' }).end();
});

module.exports = userRouter;
