import express from 'express';
import cors from 'cors';
import { apiRouter } from './core/routes/api-router';
import { setupSwagger } from './core/config/swagger';

export const initApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/api', apiRouter);
  setupSwagger(app);

  return app;
};
