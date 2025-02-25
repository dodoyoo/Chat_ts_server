import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction, response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import compression from 'compression';

export const createApp = () => {
  const fs = require('fs');
  const app = express();

  app.use(
    cors({
      origin: '*',
    })
  );
  app.use(morgan('combined'));
  app.use(express.json());
  app.use(express.static('public'));
  app.use('/css', express.static('./static/css'));
  app.use('/js', express.static('./static/js'));
  // app.use(compression());

  app.get('/ping', (_: Request, res: Response) => {
    res.status(200).json({ message: 'pong' });
  });

  app.get('/', function (request, response) {
    fs.readFile('./static/js/index.html', function (err: any, data: any) {
      if (err) {
        response.send('에러');
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();
      }
    });
  });

  return app;
};
