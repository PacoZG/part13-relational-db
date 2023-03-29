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

```JS
const Sequelize = require('sequelize');
const { sequelize } = require('../utils/db');

class User extends Sequelize.Model {}


User.init(
  {
    id: {
      type: Sequelize.DataTypes.UUIDV4,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: Sequelize.DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Username format is not correct',
        },
        is: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      },
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 16],
      },
    },
    password_hash: {
      type: Sequelize.DataTypes.STRING,
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

module.exports = User;
```

Next is the endpoint configuration for all user calls and the file can be found [here](../../server/src/controllers/users.ts)

```JS
const bcrypt = require('bcrypt');
const Router = require('express').Router;
const { Blog, User } = require('../models');
const { SECRET } = require('../utils/config');

const jwt = require('jsonwebtoken');

const userRouter = Router();

userRouter.get('/', async (_req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
    attributes: { exclude: ['password_hash'] },
  });
  res.json(users);
});

userRouter.post('/', async (req, res) => {
  const { name, username, password } = req.body;

  if (!password) {
    return res.status(403).json({ message: 'Password needs to be provided' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const newUser = {
    name,
    username,
    password_hash: passwordHash,
  };

  const user = await User.create(newUser);

  const userForToken = {
    id: user.dataValues.id,
    username: user.dataValues.username,
  };

  const token = jwt.sign(userForToken, SECRET);
  res.status(201).json({ username: user.dataValues.username, token });
});

userRouter.get('/:username', async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.status(200).json(user);
});

userRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  await user?.destroy();
  res.status(200).json({ message: 'User deleted' }).end();
});

module.exports = userRouter;
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

```JS
const errorHandler = (error, _req, res, next) => {
  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).send({
      error: error.errors[0].message,
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).send({
      error: error.errors[0].message,
    });
  }

  if (error) {
    return res.status(400).send({
      error: error.errors[0].message,
    });
  }

  next(error);
};
```

### Exercise 13.10.
Expand the application so that the current logged-in user identified by a token is linked to each blog added. To do this you will also need to implement a login endpoint POST /api/login, which returns the token.

## Result:

The implementation can be found [here](../../server/src/controllers/login.ts) and it has been implemented as shown below:

```JS
const bcrypt = require('bcrypt');
const Router = require('express').Router;
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../utils/config');

const loginRouter = Router();

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user?.dataValues.password_hash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid username or password',
    });
  }

  const userForToken = {
    username: user?.dataValues.username,
    id: user?.dataValues.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  res.status(200).send({ token, username: user?.dataValues.username, name: user?.dataValues.name });
});

module.exports = loginRouter;

```

### Exercise 13.11.
Make deletion of a blog only possible for the user who added the blog.

## Result:

```JS
blogRouter.delete('/:id', [blogFinder, tokenExtractor], async (req, res) => {
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
```JS
blogRouter.get('/', async (_req, res) => {
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
```JS
userRouter.get('/', async (_req, res) => {
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