import cors from 'cors';
import express, { Application, Request, Response } from 'express';

import globalError from './app/middlewares/globalError';
import router from './app/routes';
import config from './app/config';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors({ origin: config.app_link, credentials: true }));

app.use('/api', router);

app.use(globalError);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world, running');
});

export default app;
