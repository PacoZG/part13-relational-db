# Task 13.24.

## Implementation:

```
Grand finale: towards the end of part 4 there was mention of a token-criticality problem: if a user's access to the system is decided to be revoked, the user may still use the token in possession to use the system.

The usual solution to this is to store a record of each token issued to the client in the backend database, and to check with each request whether access is still valid. In this case, the validity of the token can be removed immediately if necessary. Such a solution is often referred to as a server-side session.

Now expand the system so that the user who has lost access will not be able to perform any actions that require login.

You will probably need at least the following for the implementation

a boolean value column in the user table to indicate whether the user is disabled

it is sufficient to disable and enable users directly from the database
a table that stores active sessions

a session is stored in the table when a user logs in, i.e. operation POST /api/login
the existence (and validity) of the session is always checked when the user makes an operation that requires login
```

For the solution of this exercise I choose to create a token that includes a creation date in it, and implemeted a middleware call <strong>checkTokenStatus</strong> that checks if the token is not expired by calculating the difference between the current time and time of the token's creation. This middleware is used in every api that need authentication to perform its task.

At the same time, I added a field in the users table call 'disabled' which by default is  __true__, its state changes when the user logs in to __false__ which means the user is allowed to do tasks that need authentication.

Once the token has expired this <strong>checkTokenStatus</strong> funtion will make sure that the state in the __disable__ field will be set to true and will force the user to login again.

All implemetation are as follows:

We can find mutations file [here](../../server/migrations/20230329_01_mutations.js) and the update user model [here](../../server/src/models/user.js)

The middleware file has the following funtionalitiy with only 60 minutes in the tokens life span:

```js
const checkTokenStatus = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = jwt.verify(authorization.substring(7), SECRET);
    const currentTime = moment();
    const timeDifferenceInMinutes = currentTime.diff(moment(token.date), 'minutes');

    const user = await User.findByPk(token.id);

    if (timeDifferenceInMinutes > 60) {
      user.disabled = true;
      await user.save();
      return res.status(401).json({ error: 'Token has expired' });
    }

    if (user.disabled) {
      return res.json({ error: 'You must login to do this' });
    }
  }
  next();
};
```

the updated blogs router the use of this middleware: 

```js
blogRouter.post('/', [tokenExtractor, checkTokenStatus], async (req, res) => {
  const { author, title, url, year } = req.body;
  const newBlog = {
    author,
    title,
    url,
    year,
  };

  const blog = await Blog.create({ ...newBlog, userId: user?.dataValues.id });

  try {
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

blogRouter.put('/:id', [blogFinder, tokenExtractor, checkTokenStatus], async (req, res) => {
  const { blog } = req;
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' }).end();
  }

  const { author, title, url, year } = req.body;
  req.blog.author = author ? author : req.blog.author;
  req.blog.title = title ? title : req.blog.title;
  req.blog.url = url ? url : req.blog.url;
  req.blog.year = year ? year : req.blog.year;

  await req.blog.save();
  return res.status(200).json(req.blog);
});

blogRouter.delete('/:id', [blogFinder, tokenExtractor, checkTokenStatus], async (req, res) => {
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

module.exports = blogRouter;
```

And the login file as been implemented using the new users field:
```js
const bcrypt = require('bcrypt');
const Router = require('express').Router;
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../utils/config');
const moment = require('moment');

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
    date: moment().format(),
  };

  user.disabled = false;
  await user.save();
  const token = jwt.sign(userForToken, SECRET);

  res.status(200).send({ token, username: user?.dataValues.username });
});

module.exports = loginRouter;
```

```
A route that allows the user to "log out" of the system, i.e. to practically remove active sessions from the database, the route can be e.g. DELETE /api/logout
Keep in mind that actions requiring login should not be successful with an "expired token", i.e. with the same token after logging out.

You may also choose to use some purpose-built npm library to handle sessions.

Make the database changes required for this task using migrations.
```

The logout route and functionality has been implemented as follows:

```js
const Router = require('express').Router;
const { User } = require('../models');
const { tokenExtractor } = require('../utils/middleware');

const logoutRouter = Router();

logoutRouter.delete('/', tokenExtractor, async (req, res) => {
  const { decodedToken } = req;

  const user = await User.findByPk(decodedToken.id);

  user.disabled = true;
  await user.save();
  res.status(200).send({ message: 'Logout successfully' });
});

module.exports = logoutRouter;
```