const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

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