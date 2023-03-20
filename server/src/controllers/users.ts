import { Router } from "express"
import * as uuidv4 from 'uuidv4'
import { User } from "../models/user"

const router: Router = Router()

router.get('/', async (_req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res) => {
  const newUser = {
    id: uuidv4.uuid(),
    ...req.body,
  }
  try {
    const user = await User.create(newUser)
    res.status(201).json(user)
  } catch(error) {
    return res.status(400).json({ message: error.message })
  }
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

export const userRouter: Router = router;