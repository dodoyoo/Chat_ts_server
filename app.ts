import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import compression from 'compression';

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: '*',
    })
  );
  app.use(morgan('combined'));
  app.use(express.json());
  app.use(express.static('public'));
  // app.use(compression());

  app.get('/ping', (_: Request, res: Response) => {
    res.status(200).json({ message: 'pong' });
  });

  return app;
};
