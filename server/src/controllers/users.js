const bcrypt = require('bcrypt');
const Router = require('express').Router;
const { Blog, User, Reading } = require('../models');
const { SECRET } = require('../utils/config');

const jwt = require('jsonwebtoken');
const { tokenExtractor } = require('../utils/middleware');

const userRouter = Router();

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' });
  }
  next();
};

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
  const { name, username, password, admin } = req.body;

  if (!password) {
    return res.status(403).json({ message: 'Password needs to be provided' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const newUser = {
    admin,
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

  res.status(201).json({ username, token });
});

// userRouter.get('/:username', async (req, res) => {
//   const { username } = req.params;
//   const user = await User.findOne({
//     where: {
//       username: username,
//     },
//   });

//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }
//   return res.status(200).json(user);
// });

userRouter.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });

  if (user) {
    user.disabled = req.body.disabled;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

userRouter.get('/:id', async (req, res) => {
  const { read } = req.query;
  const { id } = req.params;

  const user = await User.findByPk(id, {
    attributes: {
      include: ['name', 'username'],
      exclude: ['id', 'password_hash', 'admin', 'disabled', 'createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          attributes: [],
        },
        include: {
          model: Reading,
          where: {
            read: read ? read : [true, false],
          },
          as: 'readinglists',
          attributes: { include: ['read', 'id'], exclude: ['userId', 'blogId'] },
        },
      },
    ],
  });

  res.json(user);
});

userRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  await user?.destroy();

  res.status(200).json({ message: 'User deleted' }).end();
});

module.exports = userRouter;
