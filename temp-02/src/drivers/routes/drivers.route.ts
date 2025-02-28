import { Request, Response, Router } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';

import { DriverStatus } from '../types/driver';
import { DriverInputDto } from '../dto/driver.input-dto';
import {
  createErrorMessages,
  inputValidationResultMiddleware,
} from '../../core/middlewares/validation/input-validtion-result.middleware';
import { driversRepository } from '../repositories/drivers.repository';
import {
  driverInputDtoValidation,
  driverStatusInputDtoValidation,
} from './driver.input-dto.validation-middlewares';
import { superAdminGuardMiddleware } from '../../accounts/middlewares/super-admin.guard-middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';

export const driversRouter = Router({});

//middleware на весь маршрут
driversRouter.use(superAdminGuardMiddleware);

driversRouter
  .get('', (req: Request, res: Response) => {
    const drivers = driversRepository.findAll();
    res.send(drivers);
  })

  .get(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      const driver = driversRepository.findById(id);

      if (!driver) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
          );

        return;
      }

      res.send(driver);
    },
  )

  .post(
    '',
    driverInputDtoValidation,
    inputValidationResultMiddleware,
    (req: Request<{}, {}, DriverInputDto>, res: Response) => {
      const newDriver = driversRepository.create(req.body);

      res.status(HttpStatus.Created).send(newDriver);
    },
  )

  .put(
    '/:id',
    idValidation,
    driverInputDtoValidation,
    inputValidationResultMiddleware,
    (req: Request<{ id: string }, {}, DriverInputDto>, res: Response) => {
      const id = parseInt(req.params.id);

      const isUpdated = driversRepository.update(id, req.body);

      if (!isUpdated) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
          );
        return;
      }

      res.sendStatus(HttpStatus.NoContent);
    },
  )

  .put(
    '/:id/status',
    idValidation,
    driverStatusInputDtoValidation,
    inputValidationResultMiddleware,
    (
      req: Request<{ id: string }, {}, { status: DriverStatus }>,
      res: Response,
    ) => {
      const id = parseInt(req.params.id);

      const driver = driversRepository.findById(id);

      if (!driver) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
          );

        return;
      }

      // Если у водителя сейчас есть заказ, то поменять ему статус нельзя
      if (driver.status === DriverStatus.OnOrder) {
        res
          .status(HttpStatus.BadRequest)
          .send(
            createErrorMessages([
              { field: 'status', message: 'The driver is currently on a job' },
            ]),
          );

        return;
      }

      //Нельзя поменять статус на 'on-order' без подробностей заказа
      //для этого есть эндпоинт в ridesRoute
      if (req.body.status === DriverStatus.OnOrder) {
        res
          .status(HttpStatus.BadRequest)
          .send(
            createErrorMessages([
              { field: 'status', message: 'Details of the order are required' },
            ]),
          );

        return;
      }

      const isUpdated = driversRepository.updateStatus(id, req.body.status);

      if (!isUpdated) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
          );

        return;
      }

      res.sendStatus(HttpStatus.NoContent);
    },
  )

  .delete(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,

    (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      const driver = driversRepository.findById(id);

      if (!driver) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
          );

        return;
      }

      // Если у водителя сейчас есть заказ, то удалить его нельзя
      if (driver.status === DriverStatus.OnOrder) {
        res
          .status(HttpStatus.BadRequest)
          .send(
            createErrorMessages([
              { field: 'status', message: 'The driver is currently on a job' },
            ]),
          );

        return;
      }

      const isDeleted = driversRepository.delete(id);

      if (!isDeleted) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
          );

        return;
      }

      res.sendStatus(HttpStatus.NoContent);
    },
  );
