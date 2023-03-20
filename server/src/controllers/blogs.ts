import { Blog } from "../models/blog";

import { Router } from "express";
import * as uuidv4 from 'uuidv4';

const router = require('express').Router()

interface BlogProps {
  id: string;
  author?: string;
  url?: string;
  title?: string;
  likes?: number;
}

const blogFinder = async (req, _res, next) => {
  const { id } = req.params
  req.blog = await Blog.findByPk(id)
  next()
}

router.get('/', async (_req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res) => {
  const newBlog = {
    id: uuidv4.uuid(),
    ...req.body
  }
  const blog = await Blog.create(newBlog)
  try {
    res.status(201).json(blog)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ message: 'Blog not found'})
  }
  return res.status(200).json(req.blog)
})

router.put('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ message: 'Blog not found'}).end()
  } 
  const { author, title, url, likes }: BlogProps = req.body
  req.blog.author = author ? author : req.blog.author  
  req.blog.title = title ? title : req.blog.title
  req.blog.url = url ? url : req.blog.url
  req.blog.likes = likes ? likes : req.blog.likes

  await req.blog.save()
  return res.status(200).json(req.blog)
})

router.delete('/:id', blogFinder, async (req, res) => {
  try {
    await req.blog.destroy()
    res.status(200).json({ message: 'Blog deleted' }).end()
  } catch (error) {
    res.json({ error: 'Blog does not exist' }).end()
  }
})

export const blogRouter: Router = router;