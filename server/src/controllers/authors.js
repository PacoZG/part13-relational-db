const Router = require('express').Router;
const { Blog } = require('../models');
const { col, fn } = require('sequelize');

const authorRouter = Router();

authorRouter.get('/', async (_req, res) => {
  const authors = await Blog.findAll({
    group: 'author',
    attributes: [
      'author',
      [fn('SUM', col('likes')), 'likes'],
      [fn('COUNT', col('author')), 'articles'],
    ],
    order: [[col('likes'), 'DESC']],
  });

  res.json(authors);
});

module.exports = authorRouter;
