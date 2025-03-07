import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import {
  changeDriverActivityValidation,
  driverInputDtoValidation,
} from './driver.input-dto.validation-middlewares';
import { superAdminGuardMiddleware } from '../../accounts/middlewares/super-admin.guard-middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { getDriverListHandler } from './handlers/get-driver-list.handler';
import { getDriverHandler } from './handlers/get-driver.handler';
import { createDriverHandler } from './handlers/create-driver.handler';
import { updateDriverHandler } from './handlers/update-driver.handler';
import { changeDriverActivityHandler } from './handlers/update-driver-status.handler';
import { deleteDriverHandler } from './handlers/delete-driver.handler';

export const driversRouter = Router({});

//middleware на весь маршрут
driversRouter.use(superAdminGuardMiddleware);

driversRouter
  .get('', getDriverListHandler)

  .get('/:id', idValidation, inputValidationResultMiddleware, getDriverHandler)

  .post(
    '',
    driverInputDtoValidation,
    inputValidationResultMiddleware,
    createDriverHandler,
  )

  .put(
    '/:id',
    idValidation,
    driverInputDtoValidation,
    inputValidationResultMiddleware,
    updateDriverHandler,
  )

  .put(
    '/:id/activity',
    idValidation,
    changeDriverActivityValidation,
    inputValidationResultMiddleware,
    changeDriverActivityHandler,
  )

  .delete(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    deleteDriverHandler,
  );
