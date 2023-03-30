This is the implementation of all the exercises for part 13 [Relational Databases](https://fullstackopen.com/en/part13) of the online [Full Stack course](https://fullstackopen.com/en/)

The estructure of this folder is as follows:

```
Exercises
  exercise-13.1-13.3
  ...
requests
  create_blog.rest
  ...
src
  server
    controllers
      authors.js
      blogs.js
      login.js
      readings.js
      users.js
    models
      blog.js
      index.js
      readings.js
      user.js
    utils
      config.js
      db.js
      logger.js
      middleware.js
      rollbackMigrations.js
      rollbackMutations.js
      runMutations.js
    app.js
    index.js
  package-lock.json
  package.json
.gitignore
README.md
...
```

To see the implementation of the server using sql database go [here](./server/)

To see the implementation of all the exercises go [here](./Exercises/)