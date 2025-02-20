import express from 'express';
import { vehiclesRouter } from '../../vehicles/routes/vehicles.route';
import { testingRouter } from '../../testing/routes/testing.route';

export const apiRouter = express.Router({});

apiRouter.use('/vehicles', vehiclesRouter);
apiRouter.use('/testing', testingRouter);
