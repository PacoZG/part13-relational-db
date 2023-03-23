require('express-async-errors');
const express = require('express');

import { authorRouter } from './controllers/authors';
import { blogRouter } from './controllers/blogs';
import { loginRouter } from './controllers/login';
import { userRouter } from './controllers/users';

import { errorHandler, requestLogger, unknownEndpoint } from './utils/middleware';

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

export { app };
