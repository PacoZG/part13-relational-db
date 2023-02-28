
const { Sequelize, Model, DataTypes } = require('sequelize')
const config = require('../utils/config')
const sequelize = new Sequelize(config.DATABASE_URL)


class Blog extends Model { }

Blog.init({
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
  }
)

module.exports =  Blog 