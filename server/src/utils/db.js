const { Sequelize, QueryTypes } = require('sequelize');
const { DATABASE_URL } = require('./config');
const { Umzug, SequelizeStorage } = require('umzug');
const { logInfo, logError } = require('./logger');

const sequelize = new Sequelize(DATABASE_URL);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    await runMutationMigration();
    logInfo('Connection has been established successfully.');
    // const blogs = await sequelize.query('SELECT * FROM blogs', { type: QueryTypes.SELECT });
    // blogs.map((blog) => console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`));
  } catch (error) {
    logError('Unable to connect to the database:', error);
    return process.exit(1);
  }
};

const creationMigrationConf = {
  migrations: {
    glob: 'migrations/20230324_01_migrations.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(creationMigrationConf);
  const migrations = await migrator.up();
  logInfo('Migrations up to date', {
    files: migrations.map((migration) => migration.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(creationMigrationConf);
  await migrator.down();
};

const migrationCreationConf = {
  migrations: {
    glob: 'migrations/20230329_01_mutations.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMutationMigration = async () => {
  const migrator = new Umzug(migrationCreationConf);
  const migrations = await migrator.up();
  logInfo('Mutations up to date', {
    files: migrations.map((migration) => migration.name),
  });
};

const rollbackMutationMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationCreationConf);
  await migrator.down();
};

module.exports = {
  connectToDatabase,
  sequelize,
  rollbackMigration,
  runMutationMigration,
  rollbackMutationMigration,
};
