import { Request, Response, Router } from 'express';
import {
  createErrorMessages,
  inputValidationResultMiddleware,
} from '../../core/middlewares/validation/input-validtion-result.middleware';
import { HttpStatus } from '../../core/types/http-statuses';
import { superAdminGuardMiddleware } from '../../accounts/middlewares/super-admin.guard-middleware';
import { ridesRepository } from '../repositories/rides.repository';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import {
  clientNameValidation,
  currencyValidation,
  driverIdValidation,
  endAddressValidation,
  priceValidation,
  rideStatusValidation,
  startAddressValidation,
} from './ride.middleware';
import { RideStatus } from '../types/ride';
import { RideInputDto } from '../dto/ride-input.dto';
import { driversRepository } from '../../drivers/repositories/drivers.repository';
import { DriverStatus } from '../../drivers/types/driver';

export const ridesRoute = Router({});

ridesRoute.get(
  '',
  superAdminGuardMiddleware,
  async (req: Request, res: Response) => {
    const rides = await ridesRepository.findAll();
    res.send(rides);
  },
);

ridesRoute.get(
  '/:id',
  superAdminGuardMiddleware,
  idValidation,
  inputValidationResultMiddleware,
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const ride = await ridesRepository.findById(id);

    if (!ride) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Ride not found' }]),
        );

      return;
    }

    res.send(ride);
  },
);
ridesRoute.post(
  '',
  superAdminGuardMiddleware,
  clientNameValidation,
  driverIdValidation,
  priceValidation,
  currencyValidation,
  startAddressValidation,
  endAddressValidation,
  inputValidationResultMiddleware,
  async (req: Request<{}, {}, RideInputDto>, res: Response) => {
    const driverId = req.body.driverId;

    const driver = await driversRepository.findById(driverId);

    if (!driver || driver.status !== DriverStatus.AwaitingOrder) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );

      return;
    }

    const newRide = await ridesRepository.create(driver, req.body);

    await driversRepository.updateStatus(driver.id, DriverStatus.OnOrder);

    res.status(HttpStatus.Created).send(newRide);
  },
);

ridesRoute.put(
  '/:id/status',
  superAdminGuardMiddleware,
  idValidation,
  rideStatusValidation,
  inputValidationResultMiddleware,
  async (
    req: Request<{ id: string }, {}, { status: RideStatus }>,
    res: Response,
  ) => {
    const id = parseInt(req.params.id);

    //TODO: Promise.all почему репо асинхронный?
    const ride = await ridesRepository.findById(id);

    if (!ride) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Ride not found' }]),
        );

      return;
    }

    const driver = await driversRepository.findById(ride.driverId);

    if (!driver) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );

      return;
    }

    //TODO: Promise.all
    const isRideUpdated = await ridesRepository.updateStatus(
      id,
      req.body.status,
    );

    const isDriverUpdated = await driversRepository.updateStatus(
      ride.driverId,
      req.body.status === RideStatus.InProgress
        ? DriverStatus.OnOrder
        : DriverStatus.AwaitingOrder,
    );

    if (!isRideUpdated || !isDriverUpdated) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Ride not found' }]),
        );

      return;
    }

    res.sendStatus(HttpStatus.NoContent);
  },
);
