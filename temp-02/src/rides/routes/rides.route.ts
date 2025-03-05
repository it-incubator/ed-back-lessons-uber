import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { superAdminGuardMiddleware } from '../../accounts/middlewares/super-admin.guard-middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import {
  rideInputDtoValidation,
  rideStatusValidation,
} from './ride.input-dto.validation-middleware';
import { createRideHandler } from './handlers/create-ride.handler';
import { getRideListHandler } from './handlers/get-ride-list.handler';
import { getRideHandler } from './handlers/get-ride.handler';
import { updateRideStatusHandler } from './handlers/update-ride-status.handler';

export const ridesRoute = Router({});

ridesRoute.use(superAdminGuardMiddleware);

ridesRoute.get('', getRideListHandler);

ridesRoute.get(
  '/:id',
  idValidation,
  inputValidationResultMiddleware,
  getRideHandler,
);
ridesRoute.post(
  '',
  rideInputDtoValidation,
  inputValidationResultMiddleware,
  createRideHandler,
);

ridesRoute.put(
  '/:id/status',

  idValidation,
  rideStatusValidation,
  inputValidationResultMiddleware,
  updateRideStatusHandler,
);
