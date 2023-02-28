# Exercises 13.1 - 13.3

I have created a small application using Node, express, express-async-errors, sequelize, uuidv4, etc,  that runs server that has access to the relational database deployed and runned in fly.io

### The results are as followed:

## Task 13.1.
Create a GitHub repository for the application and create a new Heroku application for it, as well as a Postgres database. Make sure you are able to establish a connection to the application database.

Since Heroku has changed to a mainly paid service for pretty much all of the resources I decided to use fly.io instead

after runnig
```
$ flyctl postgres create
```
and setting name, region and configuration I proceeded to connect with the application by running...
```
$ flyctl proxy 5432 -a fullstack-part13-blogs
```
and by running
```
$ flyctl postgres connect -a fullstack-part13-blogs
```

I get access to the postgres terminal and start managing my tables in the database with the usual psql commands, like ```postgres=# \d``` ,  or ```postgres=# \l``` , or ```postgres=# \d blogs``` to see the table's model.

that allows me to connect with the recently deployed database 
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

The functionality can also be found [here](../server/utils/config.js)

And this is the result in the terminal

![terminal](./Screenshot%202023-02-28%20at%2013.20.09.png)