import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/db'

class User extends Model { }

User.init({
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.TIME,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  modelName: 'user'
})

export { User }
