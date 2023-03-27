import * as Sequelize from 'sequelize';
import { sequelize } from '../utils/db';

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

export { User };
