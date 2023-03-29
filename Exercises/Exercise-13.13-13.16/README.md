# Tasks 13.13.-13.16

### Task 13.13.
Implement filtering by keyword in the application for the route returning all blogs. The filtering should work as follows

```GET /api/blogs?search=react``` returns all blogs with the search word react in the title field, the search word is case-insensitive
GET /api/blogs returns all blogs
This should be useful for this task and the next one.

### Exercise 13.14.
  Expand the filter to search for a keyword in either the title or author fields, i.e.
  
  ```GET /api/blogs?search=jami``` returns blogs with the search word jami in the title field or in the author field

### Exercise 13.15.
Modify the blogs route so that it returns blogs based on likes in descending order. Search the documentation for instructions on ordering,


The solution for all three of previous tasks is as follows:

```JS
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
```

I also added the possibility of ordering the results by created date
___


### Task 13.16.
Make a route for the application ```/api/authors``` that returns the number of blogs for each author and the total number of likes. Implement the operation directly at the database level. You will most likely need the group by functionality, and the sequelize.fn aggregator function.

### Result:

```JS
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

````
