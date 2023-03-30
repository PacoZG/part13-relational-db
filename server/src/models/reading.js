const Sequelize = require('sequelize');
const { sequelize } = require('../utils/db');
class Reading extends Sequelize.Model {}

Reading.init(
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    blogId: {
      type: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      references: { model: 'blogs', key: 'id' },
    },
    read: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'reading',
  },
);

module.exports = Reading;
