const bcrypt = require('bcrypt');
const Router = require('express').Router;
const { Blog, User, Reading } = require('../models');
const { SECRET } = require('../utils/config');

const jwt = require('jsonwebtoken');
const { tokenExtractor } = require('../utils/middleware');
const readingsRouter = Router();

readingsRouter.post('/', async (req, res) => {
  const { blogId, userId } = req.body;
  const reading = await Reading.create({
    blogId,
    userId,
  });

  res.json(reading);
});

readingsRouter.put('/:id', tokenExtractor, async (req, res) => {
  const { read } = req.body;
  const { id } = req.params;

  const readingToUpdate = await Reading.findByPk(id);

  if (req.decodedToken.id !== readingToUpdate.userId) {
    return res.json({ message: "You can't update this list, bruuuuh!" });
  }

  if (readingToUpdate) {
    readingToUpdate.read = read;
    await readingToUpdate.save();
    res.json(readingToUpdate);
  } else {
    res.status(404).end();
  }
});

module.exports = readingsRouter;
