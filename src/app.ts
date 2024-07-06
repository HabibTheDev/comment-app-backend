import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalError from './app/middlewares/globalError';
import router from './app/routes';
import config from './app/config';
import http from 'http';
import { Server } from 'socket.io';
import socketEvents from './app/modules/Comment/comment.socket';

// Create an Express application
const app: Application = express();

// Create an HTTP server and bind it with the Express application
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = new Server(server, {
  path: '/',
  cors: {
    origin: config.app_link,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
  },
});

// Middleware setup
app.use(express.json());
app.use(cors({ origin: config.app_link, credentials: true }));

// Initialize Socket.IO events
socketEvents(io);

// Set up Express routes
app.use('/api', router);

// Global error handler
app.use(globalError);

// Default route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('Hello world, running');
});

export { app, io };
