require('express-async-errors');
const express = require('express');
const authorRouter = require('./controllers/authors');
const blogRouter = require('./controllers/blogs');
const loginRouter = require('./controllers/login');
const userRouter = require('./controllers/users');
const { requestLogger, errorHandler, unknownEndpoint } = require('./utils/middleware');

const app = express();

app.use(express.json());

app.use(requestLogger);

app.use(express.static('build'));

app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/authors', authorRouter);

app.get('/health', (_req, res) => {
  res.send('ok');
});

app.use(errorHandler);
app.use(unknownEndpoint);

module.exports = app;
