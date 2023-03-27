import * as Sequelize from 'sequelize';
import { sequelize } from '../utils/db';

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
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'blog',
  },
);

export { Blog };
