import { Router } from 'express';
import { col, fn } from 'sequelize';
import { Blog } from '../models';

const router = require('express').Router();

router.get('/', async (_req, res) => {
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

export const authorRouter: Router = router;
