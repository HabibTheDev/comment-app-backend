import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalError from './app/middlewares/globalError';
import router from './app/routes';
import config from './app/config';
import http from 'http';
import socketIO, { Server } from 'socket.io';

const app: Application = express();

const server = http.createServer(app);
const io: Server = new socketIO.Server(server, {
  cors: {
    origin: config.app_link,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
  },
});

//parsers
app.use(express.json());
app.use(cors({ origin: config.app_link, credentials: true }));

app.use('/api', router);

app.use(globalError);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world, running');
});

export { app, io };
