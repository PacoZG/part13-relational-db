# Tasks 13.19.-13.23.

### Task 13.19.
Give users the ability to add blogs on the system to a reading list. When added to the reading list, the blog should be in the unread state. The blog can later be marked as read. Implement the reading list using a connection table. Make database changes using migrations.

In this task, adding to a reading list and displaying the list need not be successful other than directly using the database.

## Implementation:

this file can be found [here](../../server/migrations/20230324_01_migrations.js)
```js
    await queryInterface.createTable(
      'readings',
      {
        id: {
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false,
          references: { model: 'users', key: 'id' },
        },
        blog_id: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false,
          references: { model: 'blogs', key: 'id' },
        },
        read: {
          type: Sequelize.DataTypes.BOOLEAN,
          default: false,
        },
      },
      {
        underscored: true,
        timestamps: true,
        modelName: 'reading',
      },
    );
```


### Exercise 13.20.
Now add functionality to the application to support the reading list.

Adding a blog to the reading list is done by making an HTTP POST to the path /api/readinglists, the request will be accompanied with the blog and user id:

```js
{
  "blogId": 10,
  "userId": 3
}
```
## Implementation:

The file can be found [here](../../server/src/controllers/readings.js)

```js
const Router = require('express').Router;
const { Reading } = require('../models');

const readingsRouter = Router();

readingsRouter.post('/', async (req, res) => {
  const { blogId, userId } = req.body;
  const reading = await Reading.create({
    blogId,
    userId,
  });

  res.json(reading);
});

module.exports = readingsRouter;
```

Also modify the individual user route GET /api/users/:id to return not only the user's other information but also the reading list, e.g. in the following format:

```js
{
  name: "Matti Luukkainen",
  username: "mluukkai@iki.fi",
  readings: [
    {
      id: 3,
      url: "https://google.com",
      title: "Clean React",
      author: "Dan Abramov",
      likes: 34,
      year: null,
    },
    {
      id: 4,
      url: "https://google.com",
      title: "Clean Code",
      author: "Bob Martin",
      likes: 5,
      year: null,
    }
  ]
}
```

At this point, information about whether the blog is read or not does not need to be available.

Task 13.21.
Expand the single-user route so that each blog in the reading list shows also whether the blog has been read and the id of the corresponding join table row.

For example, the information could be in the following form:

```js
{
  name: "Matti Luukkainen",
  username: "mluukkai@iki.fi",
  readings: [
    {
      id: 3,
      url: "https://google.com",
      title: "Clean React",
      author: "Dan Abramov",
      likes: 34,
      year: null,
      readinglists: [
        {
          read: false,
          id: 2
        }
      ]
    },
    {
      id: 4,
      url: "https://google.com",
      title: "Clean Code",
      author: "Bob Martin",
      likes: 5,
      year: null,
      readinglists: [
        {
          read: false,
          id: 3
        }
      ]
    }
  ]
}
```

Note: there are several ways to implement this functionality. This should help.

Note also that despite having an array field readinglists in the example, it should always just contain exactly one object, the join table entry that connects the book to the particular user's reading list.

### Implemenmtation in the users router for exercises 13.20 and 13.21

```js
userRouter.get('/:id', async (req, res) => {
  const { read } = req.query;
  const { id } = req.params;

  const user = await User.findByPk(id, {
    attributes: {
      include: ['name', 'username'],
      exclude: ['id', 'password_hash', 'admin', 'disabled', 'createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          attributes: [],
        },
        include: {
          model: Reading,
          where: {
            read: read ? read : [true, false],
          },
          as: 'readinglists',
          attributes: { include: ['read', 'id'], exclude: ['userId', 'blogId'] },
        },
      },
    ],
  });

  res.json(user);
});
```


Exercise 13.22.
Implement functionality in the application to mark a blog in the reading list as read. Marking as read is done by making a request to the PUT /api/readinglists/:id path, and sending the request with

```js
{
  "read": true
}
```

## Implementation:

The file can be found [here](../../server/src/controllers/readings.js)

```js
readingsRouter.put('/:id', tokenExtractor, async (req, res) => {
  const { read } = req.body;
  const { id } = req.params;

  const readingToUpdate = await Reading.findByPk(id);

  if (req.decodedToken.id !== readingToUpdate.userId) {
    return res.json({ message: "You can't update this list, bruuuuh!" });
  }

  if (readingToUpdate) {
    readingToUpdate.read = read;
    await readingToUpdate.save();
    res.json(readingToUpdate);
  } else {
    res.status(404).end();
  }
});
```

The user can only mark the blogs in their own reading list as read. The user is identified as usual from the token accompanying the request.

Exercise 13.23.
Modify the route that returns a single user's information so that the request can control which of the blogs in the reading list are returned:

```
GET /api/users/:id returns the entire reading list
GET /api/users/:id?read=true returns blogs that have been read
GET /api/users/:id?read=false returns blogs that have not been read
```

## Implemtentation:

```js
userRouter.get('/:id', async (req, res) => {
  const { read } = req.query;
  console.log({ read });

  const { id } = req.params;

  const user = await User.findByPk(id, {
    attributes: {
      include: ['name', 'username'],
      exclude: ['id', 'password_hash', 'admin', 'disabled', 'createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          attributes: [],
        },
        include: {
          model: Reading,
          where: {
            read: read ? read : [true, false],
          },
          as: 'readinglists',
          attributes: { include: ['read', 'id'], exclude: ['userId', 'blogId'] },
        },
      },
    ],
  });

  res.json(user);
});
```
