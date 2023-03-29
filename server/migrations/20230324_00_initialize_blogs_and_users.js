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
          validate: {
            isEmail: {
              msg: 'Validation isEmail on username failed',
            },
            is: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          },
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
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('blogs');
    await queryInterface.dropTable('users');
  },
};
