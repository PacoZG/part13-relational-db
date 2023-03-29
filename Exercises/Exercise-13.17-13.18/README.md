# Tasks 13.17-13.18.

### Task 13.17.
Delete all tables from your application's database.

Make a migration that initializes the database. Add created_at and updated_at timestamps for both tables. Keep in mind that you will have to add them in the migration yourself.

NOTE: be sure to remove the commands User.sync() and Blog.sync(), which synchronizes the models' schemas from your code, otherwise your migrations will fail.

NOTE2: if you have to delete tables from the command line (i.e. you don't do the deletion by undoing the migration), you will have to delete the contents of the migrations table if you want your program to perform the migrations again.

### Task 13.18.
Expand your application (by migration) so that the blogs have a year written attribute, i.e. a field year which is an integer at least equal to 1991 but not greater than the current year. Make sure the application gives an appropriate error message if an incorrect value is attempted to be given for a year written.

### Result:

For both tasks the results is a shown below

```JS
const Sequelize = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'created_at', {
      type: Sequelize.DataTypes.DATE,
    });
    await queryInterface.addColumn('users', 'updated_at', {
      type: Sequelize.DataTypes.DATE,
    });
    await queryInterface.addColumn('blogs', 'created_at', {
      type: Sequelize.DataTypes.DATE,
    });
    await queryInterface.addColumn('blogs', 'updated_at', {
      type: Sequelize.DataTypes.DATE,
    });
    await queryInterface.addColumn('blogs', 'year', {
      type: Sequelize.DataTypes.INTEGER,
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'created_at');
    await queryInterface.removeColumn('users', 'updated_at');
    await queryInterface.removeColumn('blogs', 'created_at');
    await queryInterface.removeColumn('blogs', 'updated_at');
    await queryInterface.removeColumn('blogs', 'year');
  },
};
```

Changes also needed to be applied in the blogs controller file

```JS
blogRouter.post('/', tokenExtractor, async (req, res) => {
  const { author, title, url, year } = req.body;
  const newBlog = {
    author,
    title,
    url,
    year,
  };

  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...newBlog, userId: user?.dataValues.id });
  try {
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
```
and in the blog model file

```JS
const Sequelize = require('sequelize');
const { sequelize } = require('../utils/db');

class Blog extends Sequelize.Model {}

Blog.init(
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    author: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'The text provided is not a URL',
        },
        is: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
      },
    },
    title: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 100],
      },
    },
    likes: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      validate: {
        customValidator(value) {
          if (value < 1991 || value > new Date().getFullYear()) {
            throw new Error('Invalid date, must be greater than 1991 or smaller that current year');
          }
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'blog',
  },
);

module.exports = Blog;
```