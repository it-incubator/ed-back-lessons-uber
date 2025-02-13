import express from 'express';
import { vehiclesRouter } from '../../vehicles/routes/vehicles.route';

export const apiRouter = express.Router({});

apiRouter.use('/vehicles', vehiclesRouter);
