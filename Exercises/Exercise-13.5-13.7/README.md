# Tasks 13.5 - 13.7

### Task 13.5.
Change the structure of your application to match the example above, or to follow some other similar clear convention.

The application's structure is as follows and can be found [here](../../server)

```
controllers
  blogs.ts
models
  blog.ts
  index.ts
utils
  config.ts
  db.ts
  logger.ts
  middleware.ts
app.ts
index.ts
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

```TS
interface BlogProps {
  id: string;
  author?: string;
  url?: string;
  title?: string;
  likes?: number;
}

blogRouter.put('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ message: 'Blog not found'}).end()
  } 
  const { author, title, url, likes }: BlogProps = req.body
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

```TS
import { NextFunction, Request, Response } from "express"
import { logError, logInfo } from "./logger"


const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  logInfo('Method:', req.method)
  logInfo('Path:  ', req.path)
  logInfo('Body:  ', req.body)
  logInfo('----------------------------------------------------------')
  next()
}

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'Unknown Endpoint' })
}

const errorHandler = (error: any, _req: Request, res: Response, next: NextFunction) => {
  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).send({
      error: 'Invalid id'
    })
  } else if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: error.message
    })
  } 
  
  logError(error.message)
  next(error)
}

export { requestLogger, unknownEndpoint, errorHandler }

```
I am also using the logger configuration:
```TS
const logInfo = (...params: any) => {
  console.log(...params);
};

const logError = (...params: any) => {
  console.error(...params);
};

export { logInfo, logError };

```

The full application can be found [here](../../server/)