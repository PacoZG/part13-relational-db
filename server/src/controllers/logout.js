const Router = require('express').Router;
const { User } = require('../models');
const { tokenExtractor } = require('../utils/middleware');

const logoutRouter = Router();

logoutRouter.delete('/', tokenExtractor, async (req, res) => {
  const { decodedToken } = req;

  const user = await User.findByPk(decodedToken.id);

  user.disabled = true;
  await user.save();
  res.status(200).send({ message: 'Logout successfully' });
});

module.exports = logoutRouter;
