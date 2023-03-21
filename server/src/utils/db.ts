const { Sequelize, QueryTypes } = require('sequelize')
const { DATABASE_URL } = require('./config')

interface Blog {
  author: string;
  title: string;
  likes: number;
}

const sequelize = new Sequelize(DATABASE_URL);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    blogs.map((blog: Blog) => 
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
      )
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    return process.exit(1)
  }
}

export { connectToDatabase, sequelize };
