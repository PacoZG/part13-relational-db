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
