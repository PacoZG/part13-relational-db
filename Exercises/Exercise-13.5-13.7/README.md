# Tasks 13.5 - 13.7

### Task 13.5.
Change the structure of your application to match the example above, or to follow some other similar clear convention.

The application's structure is as follows and can be found [here](../../server)

```
index.js
app.js
util
  config.js
  db.js
  logger.js
  middleware.js
models
  blog.js
  index.js
controllers
  blogs.js
```
__________

### Task 13.6.
Also, implement support for changing the number of a blog's likes in the application, i.e. the operation
```
PUT /api/blogs/:id (modifying the like count of a blog)
```

The updated number of likes will be relayed with the request:
```js
{
  likes: 3
}
```

## The implementation for this exercise is as follows:

```JS
blogRouter.put('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ message: 'Blog not found'}).end()
  } 
  const { author, title, url, likes } = req.body
  req.blog.author = author ? author : req.blog.author  
  req.blog.title = title ? title : req.blog.title
  req.blog.url = url ? url : req.blog.url
  req.blog.likes = likes ? likes : req.blog.likes

  await req.blog.save()
  return res.status(200).json(req.blog)
})
```
The full implementation can be found [here](../../server/controllers/blogs.js)

______

### Task 13.7.
Centralize the application error handling in middleware as in part 3. You can also enable middleware express-async-errors as we did in part 4.

The data returned in the context of an error message is not very important.

At this point, the situations that require error handling by the application are creating a new blog and changing the number of likes on a blog. Make sure the error handler handles both of these appropriately.

For this task I used the same middleware configuration on which I check if the path is correct and the data structure is also correct

The implementation is as follows:

```JS
const logger = require('./logger')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('----------------------------------------------------------')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown Endpoint' })
}

const errorHandler = (error, req, res, next) => {
  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).send({
      error: 'Invalid id'
    })
  } else if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: error.message
    })
  } 
  
  logger.error(error.message)
  next(error)
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }
```
I am also using the logger configuration:
```JS
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = { info, error }
```

The full application can be found [here](../../server/)