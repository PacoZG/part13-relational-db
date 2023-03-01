# Task 13.4
```ts
Transform your application into a web application that supports the following operations

GET api/blogs (list all blogs)
POST api/blogs (add a new blog)
DELETE api/blogs/:id (delete a blog)
The implementation for the
```

The implementation for this exercise is as follows:

```Javascript
const { v4: uuidv4 } = require('uuid')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

blogRouter.post('/', async (req, res) => {
  const { author, title, url } = req.body
  const newBlog = {
    id: uuidv4(),
    author,
    title,
    url
  }

  try {
    const blog = Blog.create(newBlog)
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

blogRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const blog = await Blog.findByPk(id)
    return res.json(blog)
  } catch (error) {
    return res.status(404).json({ error: 'Blog not found'})
  }
})

blogRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { author, title, url } = req.body
  const blog = await Blog.findByPk(id)
  if (blog) {
    blog.author = author
    blog.title = title
    blog.url = url
    await blog.save()
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

blogRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await Blog.destroy({
      where: {
        id: id
      }
    })
    return response.status(204).json().end()
  } catch (error) {
    return res.status(204).json({ error: 'Blog does not exist' })
  }
})

module.exports = blogRouter
```
