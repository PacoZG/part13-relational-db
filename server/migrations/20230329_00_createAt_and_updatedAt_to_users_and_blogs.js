const Sequelize = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    // await queryInterface.addColumn('users', 'admin', {
    //   type: Sequelize.DataTypes.BOOLEAN,
    //   default: false,
    // });
    // await queryInterface.addColumn('users', 'disabled', {
    //   type: Sequelize.DataTypes.BOOLEAN,
    //   default: false,
    // });
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
