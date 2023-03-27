import { NextFunction, Request, Response } from 'express';
import { logInfo } from './logger';

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  logInfo('Method:', req.method);
  logInfo('Path:  ', req.path);
  logInfo('Body:  ', req.body);
  logInfo('----------------------------------------------------------');
  next();
};

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'Unknown Endpoint' });
};

const errorHandler = (error: any, _req: Request, res: Response, next: NextFunction) => {
  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).send({
      error: error.errors[0].message,
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).send({
      error: error.errors[0].message,
    });
  }

  if (error) {
    return res.status(400).send({
      error: error.errors[0].message,
    });
  }

  next(error);
};

export { requestLogger, unknownEndpoint, errorHandler };
