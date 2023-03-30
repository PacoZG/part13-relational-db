const Sequelize = require('sequelize');
const { sequelize } = require('../utils/db');

class User extends Sequelize.Model {}

User.init(
  {
    id: {
      type: Sequelize.DataTypes.UUID,
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
        customeValidator(value) {
          if (value.length < 4 || value.length > 16) {
            throw new Error('Name must be between 4 and 16 characters long');
          }
        },
      },
    },
    password_hash: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    },
    admin: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
    },
    disabled: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
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
