# Tasks 13.8 - 13.12

### Task 13.8.
Add support for users to the application. In addition to ID, users have the following fields:

name (string, must not be empty)
username (string, must not be empty)
Unlike in the material, do not prevent Sequelize from creating timestamps created_at and updated_at for users

All users can have the same password as the material. You can also choose to properly implement passwords as in part 4.

Implement the following routes

POST api/users (adding a new user)
GET api/users (listing all users)
PUT api/users/:username (changing a username, keep in mind that the parameter is not id but username)
Make sure that the timestamps created_at and updated_at automatically set by Sequelize work correctly when creating a new user and changing a username.

## Result:

Next portion of code can be found [here](../../server/src/models/user.ts) for sequelize user's configuration

```TS
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db';

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Validation isEmail on username failed',
        },
        is: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'user',
  },
);

export { User };
```
Next is the endpoint configuration for all user calls and the file can be found [here](../../server/src/controllers/users.ts)

```TS
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
```

### Exercise 13.9.
Sequelize provides a set of pre-defined validations for the model fields, which it performs before storing the objects in the database.

It's decided to change the user creation policy so that only a valid email address is valid as a username. Implement validation that verifies this issue during the creation of a user.

Modify the error handling middleware to provide a more descriptive error message of the situation (for example, using the Sequelize error message), e.g.

```json
{
    "error": [
        "Validation isEmail on username failed"
    ]
}
```

## Result:

The validation for the creation of a user with email as username can be found above in the result exercise 13.8 or [here](../../server/src/models/user.ts) and the implementation of the middleware can be found [here](../../server/src/utils/middleware.ts) and it has been done as shown below:

```TS
const errorHandler = (error: any, _req: Request, res: Response, next: NextFunction) => {
  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).send({
      error: 'Invalid ID',
    });
  }

  if (error.errors[0].validatorName === 'isEmail') {
    return res.status(400).send({
      error: error.errors[0].message,
    });
  }

  if (error.errors[0].validatorName === 'isUrl') {
    return res.status(400).send({
      error: error.errors[0].message,
    });
  }
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: error.message,
    });
  }
  next(error);
};
```

### Exercise 13.10.
Expand the application so that the current logged-in user identified by a token is linked to each blog added. To do this you will also need to implement a login endpoint POST /api/login, which returns the token.

## Result:

The implementation can be found [here](../../server/src/controllers/login.ts) and it has been implemented as shown below:

```TS
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
```

### Exercise 13.11.
Make deletion of a blog only possible for the user who added the blog.

## Result:

```TS
router.delete('/:id', [blogFinder, tokenExtractor], async (req, res) => {
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
```


### Task 13.12.
Modify the routes for retrieving all blogs and all users so that each blog shows the user who added it and each user shows the blogs they have added.

## Result:

Blogs showing the user who created the blog:
```TS
router.get('/', async (_req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
  });
  res.json(blogs);
});
```

Users showing the blogs belonging to each user:
```TS
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
```