import bcrypt from 'bcrypt';
import { Router } from "express";
import { User } from "../models";
const jwt = require('jsonwebtoken')

import { SECRET } from '../utils/config';

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

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user?.dataValues.password_hash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const userForToken = {
    username: user?.dataValues.username,
    id: user?.dataValues.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  res.status(200).send({ token, username: user?.dataValues.username, name: user?.dataValues.name })
})


export const loginRouter: Router = router;