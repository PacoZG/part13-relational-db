const Sequelize = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable(
      'users',
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
        },
        name: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        password_hash: {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        underscored: true,
        timestamps: true,
        modelName: 'user',
      },
    );

    await queryInterface.createTable(
      'blogs',
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
        },
        title: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        likes: {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        underscored: true,
        timestamps: true,
        modelName: 'blog',
      },
    );

    await queryInterface.addColumn('blogs', 'user_id', {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    });

    await queryInterface.createTable(
      'readings',
      {
        id: {
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false,
          references: { model: 'users', key: 'id' },
        },
        blog_id: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false,
          references: { model: 'blogs', key: 'id' },
        },
        read: {
          type: Sequelize.DataTypes.BOOLEAN,
          default: false,
        },
      },
      {
        underscored: true,
        timestamps: true,
        modelName: 'reading',
      },
    );
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('readings');
    await queryInterface.dropTable('blogs');
    await queryInterface.dropTable('users');
  },
};
