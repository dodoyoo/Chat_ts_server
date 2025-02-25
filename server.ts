import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import { AppDataSource } from './src/models/dataSource';
import { createApp } from './app';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Any } from 'typeorm';

const app = createApp();
const port = process.env.PORT || 3000;
const HOST = process.env.HOST;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

interface CustomSocket extends Socket {
  name?: string; // name 속성 추가
}

io.on('connection', (socket: CustomSocket) => {
  socket.on('newUser', (name: string) => {
    console.log(name + ' 님이 접속하였습니다.');

    socket.name = name; //  name 속성을 안전하게 추가

    io.sockets.emit('update', {
      type: 'connect',
      name: 'SERVER',
      message: `${name}님이 접속하였습니다.`,
    });
  });

  socket.on('message', (data) => {
    if (socket.name) {
      data.name = socket.name;
      console.log(data);
      socket.broadcast.emit('update', data); // 오타 수정 ('updata' → 'update')
    }
  });

  socket.on('disconnect', () => {
    if (socket.name) {
      console.log(socket.name + '님이 나갔습니다.');

      socket.broadcast.emit('update', {
        type: 'disconnect',
        name: 'SERVER',
        message: `${socket.name}님이 나갔습니다.`,
      });
    }
  });
});
//   console.log('A user connected:', socket.id);

//   socket.on('message', (data) => {
//     console.log('Received message:', data);
//     io.emit('message', data); // 모든 클라이언트에게 메시지 전송
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected:', socket.id);
//   });

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API with Swagger',
    version: '1.0.0',
    description:
      'A simple CRUD API application made with Express and documented with Swagger',
  },
  servers: [
    {
      url: `${HOST}:${port}`,
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/domain/user/*.ts'],
};
const swaggerSpec = swaggerJSDoc(options);

(async () => {
  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');

      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

      app.all('*', (req: Request, res: Response, next: NextFunction) => {
        const err = new Error(`Can't find ${req.originalUrl} on this server!`);

        next(err);
      });

      server.listen(port, async () => {
        console.log(`Server is running on port ${port}`);
        console.log(
          `Swagger docs available at http://localhost:${port}/api-docs`
        );
      });
    })
    .catch((error) =>
      console.error('Error during Data Source initialization:', error)
    );
})();
