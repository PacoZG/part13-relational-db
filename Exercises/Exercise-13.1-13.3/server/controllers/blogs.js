require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const blogRouter = require('express').Router()
const Blog = require('../Models/blog')


// const { Sequelize, Model, DataTypes } = require('sequelize')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

blogRouter.post('/', async (req, res) => {

})

module.exports = blogRouter