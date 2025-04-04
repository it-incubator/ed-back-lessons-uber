import express, { Express } from 'express';
import { setupSwagger } from './core/swagger/setup-swagger';
import { driversRouter } from './drivers/routes/drivers.route';
import { testingRouter } from './testing/routes/testing.route';

/**
 * Настраиваем routes, cors, swagger
 * @param app
 */
export const setupApp = (app: Express) => {
  app.use(express.json());

  app.use('/api/drivers', driversRouter);
  app.use('/api/testing', testingRouter);

  setupSwagger(app);

  return app;
};
