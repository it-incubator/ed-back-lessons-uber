import express, { Express } from 'express';
import cors from 'cors';
import { setupSwagger } from './core/swagger/setup-swagger';
import { driversRouter } from './drivers/routes/drivers.route';
import { testingRouter } from './testing/routes/testing.route';
import { ridesRoute } from './rides/routes/rides.route';

/**
 * Настраиваем routes, cors, swagger
 * @param app
 */
export const setupApp = (app: Express) => {
  app.use(cors());
  app.use(express.json());

  app.use('/api/drivers', driversRouter);
  app.use('/api/rides', ridesRoute);
  app.use('/api/testing', testingRouter);

  setupSwagger(app);

  return app;
};
