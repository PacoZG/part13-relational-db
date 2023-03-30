const Blog = require('./blog');
const Reading = require('./reading');
const User = require('./user');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: Reading, as: 'readings' });
Blog.hasMany(Reading, { as: 'readinglists' });

module.exports = { Blog, User, Reading };
