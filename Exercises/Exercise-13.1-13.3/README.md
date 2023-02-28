# Exercises 13.1 - 13.3

I have created a small application using Node, express, express-async-errors, sequelize, uuidv4, etc,  that runs server that has access to the relational database deployed and runned in fly.io

### The results are as followed:

## Task 13.1.
Create a GitHub repository for the application and create a new Heroku application for it, as well as a Postgres database. Make sure you are able to establish a connection to the application database.

> This is the [url](https://github.com/PacoZG/part13-relational-db) to the public repository

## Task 13.2.
On the command-line, create a blogs table for the application with the following columns:

- id (unique, incrementing id)
- author (string)
- url (string that cannot be empty)
- title (string that cannot be empty)
- likes (integer with default value zero)
- Add at least two blogs to the database.

Save the SQL-commands you used at the root of the application repository in the file called commands.sql

The sql file can be found [here](./commands.sql)

## Exercise 13.3.
Create functionality in your application, which prints the blogs in the database on the command-line, e.g. as follows:

```Javascript
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
```

The functionality can also be found [here](./server/utils/config.js)

And this is the result in the terminal

![terminal](./Screenshot%202023-02-28%20at%2013.20.09.png)