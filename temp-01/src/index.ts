import { Request, Response } from 'express';
import { initApp } from './init-app';
import { config } from './core/config/config';

const app = initApp();
const PORT = config.port;

app.get('/', (req: Request, res: Response) => {
  res.send(`Hello`);
});

const startApp = async () => {
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
  return app;
};

startApp();
