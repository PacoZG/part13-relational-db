import { Router } from "express";
const jwt = require('jsonwebtoken')

import { SECRET } from '../utils/config';
const User = require('../models/user')

interface UserAttributes {
  username: string;
  password: string;
  id: string;
}

const router: Router = Router()

router.post('/', async (req, res) => {
  const { username, password }: UserAttributes = req.body

  const user = await User.findOne({
    where: {
      username: username
    }
  })

  const passwordCorrect = password === 'secret'

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  res.status(200).send({ token, username: user.username, name: user.name })
})


export const loginRouter: Router = router;