require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const PORT = process.env.PORT || 3001
const DATABASE_URL = process.env.DATABASE_URL

const sequelize = new Sequelize(DATABASE_URL)

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    blogs.map(blog => 
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
      )
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

module.exports = { PORT, DATABASE_URL, main }
