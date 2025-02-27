import { Request, Response, Router } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';

import { DriverStatus } from '../types/driver';
import { DriverInputDto } from '../dto/driver.input-dto';
import {
  createErrorMessages,
  inputValidationMiddleware,
} from '../../core/utils/error.utils';
import { driversRepository } from '../repositories/drivers.repository';
import {
  driverStatusValidation,
  emailValidation,
  nameValidation,
  phoneNumberValidation,
  vehicleDescriptionValidation,
  vehicleFeaturesValidation,
  vehicleLicensePlateValidation,
  vehicleMakeValidation,
  vehicleModelValidation,
  vehicleYearValidation,
} from './driver.middlewares';
import { adminMiddleware } from '../../core/middlewares/admin.middleware';
import { idValidation } from '../../core/middlewares/params-id.middleware';

export const driversRouter = Router({});

driversRouter
  .get('', adminMiddleware, async (req: Request, res: Response) => {
    const drivers = await driversRepository.findAll();
    res.send(drivers);
  })

  .get(
    '/:id',
    adminMiddleware,
    idValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      const driver = await driversRepository.findById(id);

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
    adminMiddleware,
    nameValidation,
    phoneNumberValidation,
    emailValidation,
    vehicleMakeValidation,
    vehicleModelValidation,
    vehicleYearValidation,
    vehicleLicensePlateValidation,
    vehicleDescriptionValidation,
    vehicleFeaturesValidation,
    inputValidationMiddleware,
    async (req: Request<{}, {}, DriverInputDto>, res: Response) => {
      const newDriver = await driversRepository.create(req.body);

      res.status(HttpStatus.Created).send(newDriver);
    },
  )

  .put(
    '/:id',
    adminMiddleware,
    idValidation,
    nameValidation,
    phoneNumberValidation,
    emailValidation,
    vehicleMakeValidation,
    vehicleModelValidation,
    vehicleYearValidation,
    vehicleLicensePlateValidation,
    vehicleDescriptionValidation,
    vehicleFeaturesValidation,
    inputValidationMiddleware,
    async (req: Request<{ id: string }, {}, DriverInputDto>, res: Response) => {
      const id = parseInt(req.params.id);

      const isUpdated = await driversRepository.update(id, req.body);

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
    adminMiddleware,
    idValidation,
    driverStatusValidation,
    inputValidationMiddleware,
    async (
      req: Request<{ id: string }, {}, { status: DriverStatus }>,
      res: Response,
    ) => {
      const id = parseInt(req.params.id);

      const isUpdated = await driversRepository.updateStatus(
        id,
        req.body.status,
      );

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
    adminMiddleware,
    idValidation,
    inputValidationMiddleware,

    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      const isDeleted = await driversRepository.delete(id);

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
