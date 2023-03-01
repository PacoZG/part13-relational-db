const { v4: uuidv4 } = require('uuid')
const blogRouter = require('express').Router()
const{ Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  const { id } = req.params
  req.blog = await Blog.findByPk(id)
  next()
}

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

blogRouter.post('/', async (req, res) => {
  const newBlog = {
    id: uuidv4(),
    ...req.body
  }
  const blog = await Blog.create(newBlog)
  try {
    res.status(201).json(blog)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

blogRouter.get('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ message: 'Blog not found'})
  }
  return res.status(200).json(req.blog)
})

blogRouter.put('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ message: 'Blog not found'}).end()
  } 
  const { author, title, url, likes } = req.body
  req.blog.author = author ? author : req.blog.author  
  req.blog.title = title ? title : req.blog.title
  req.blog.url = url ? url : req.blog.url
  req.blog.likes = likes ? likes : req.blog.likes

  await req.blog.save()
  return res.status(200).json(req.blog)
})

blogRouter.delete('/:id', blogFinder, async (req, res) => {
  try {
    await req.blog.destroy()
    res.status(200).json({ message: 'Blog deleted' }).end()
  } catch (error) {
    res.json({ error: 'Blog does not exist' }).end()
  }
})

module.exports = blogRouter