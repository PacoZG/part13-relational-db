const Router = require('express').Router;
const Op = require('sequelize').Op;
const jwt = require('jsonwebtoken');

const { Blog, User } = require('../models');
const { SECRET } = require('../utils/config');
const { tokenExtractor } = require('../utils/middleware');

const blogRouter = Router();

const blogFinder = async (req, _res, next) => {
  const { id } = req.params;
  req.blog = await Blog.findByPk(id);
  next();
};

blogRouter.get('/', async (req, res) => {
  const { search, created_at } = req.query;
  let order = 'DESC';
  let orderCriteria;

  const getOrderCriteria = () => {
    if (created_at) {
      order = created_at;
      orderCriteria = 'createAt';
      return orderCriteria;
    }
    orderCriteria = 'likes';
    return orderCriteria;
  };

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where: {
      [Op.or]: [
        {
          title: {
            [Op.substring]: search ? search : '',
          },
        },
        {
          author: {
            [Op.substring]: search ? search : '',
          },
        },
      ],
    },
    order: [[getOrderCriteria(), order]],
  });
  res.json(blogs);
});

blogRouter.post('/', tokenExtractor, async (req, res) => {
  const { author, title, url, year } = req.body;
  const newBlog = {
    author,
    title,
    url,
    year,
  };

  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...newBlog, userId: user?.dataValues.id });
  try {
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

blogRouter.get('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  return res.status(200).json(req.blog);
});

blogRouter.put('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ message: 'Blog not found' }).end();
  }
  const { author, title, url, likes, year } = req.body;
  req.blog.author = author ? author : req.blog.author;
  req.blog.title = title ? title : req.blog.title;
  req.blog.url = url ? url : req.blog.url;
  req.blog.likes = likes ? likes : req.blog.likes;
  req.blog.year = year ? year : req.blog.year;

  await req.blog.save();
  return res.status(200).json(req.blog);
});

blogRouter.delete('/:id', [blogFinder, tokenExtractor], async (req, res) => {
  const { decodedToken, blog } = req;

  if (decodedToken.id !== blog.userId) {
    return res.json({ message: "You can't delete this blog, bruuuuh!" });
  }

  try {
    await req.blog.destroy();
    res.status(200).json({ message: 'Blog deleted' }).end();
  } catch (error) {
    res.json({ error: 'Blog does not exist' }).end();
  }
});

module.exports = blogRouter;
