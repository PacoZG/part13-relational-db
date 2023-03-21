import bcrypt from 'bcrypt'
import { Router } from "express"
import * as uuidv4 from 'uuidv4'
import { Blog, User } from "../models"
import { SECRET } from '../utils/config'

const jwt = require('jsonwebtoken')
const router: Router = Router()

router.get('/', async (_req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
    attributes: { exclude: [ 'password_hash']}
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const { name, username, password } = req.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const newUser = {
    id: uuidv4.uuid(),
    name,
    username,
    password_hash: passwordHash
  }

  const userForToken = {
    username,
    id: newUser.id,
  }

  const token = jwt.sign(userForToken, SECRET)
  const user = await User.create(newUser)
  res.status(201).json({...user, token })
})

router.get('/:username', async (req, res) => {
  const { username } = req.params
  const user = await User.findOne({
    where: {
      username: username
    }
  })
  
  if (!user) {
    return res.status(404).json({ message: 'User not found'})
  }
  return res.status(200).json(user)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const user = await User.findByPk(id)
  await user?.destroy()
  res.status(200).json({ message: 'User deleted' }).end()
})

export const userRouter: Router = router;