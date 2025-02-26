import { Request, Response, Router } from 'express';
import {
  createErrorMessages,
  inputValidationMiddleware,
} from '../../core/utils/error.utils';
import { HttpStatus } from '../../core/types/http-statuses';
import { adminMiddleware } from '../../core/middlewares/admin.middleware';
import { ridesRepository } from '../repositories/rides.repository';
import { idValidation } from '../../core/middlewares/params-id.middleware';
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

export const ridesRoute = Router({});

ridesRoute.get('', async (req: Request, res: Response) => {
  const rides = await ridesRepository.findAll();
  res.send(rides);
});

ridesRoute.get(
  '/:id',
  idValidation,
  inputValidationMiddleware,
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

    const driver = await driversRepository.findById(ride.driverId);

    if (!driver) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([
            { field: 'driverId', message: 'Driver not found' },
          ]),
        );

      return;
    }

    const result = {
      ...ride,
      date: ride.updatedAt
        ? ride.updatedAt.toISOString()
        : ride.createdAt.toISOString(),
    };

    res.send(result);
  },
);
ridesRoute.post(
  '',
  adminMiddleware,
  clientNameValidation,
  driverIdValidation,
  priceValidation,
  currencyValidation,
  startAddressValidation,
  endAddressValidation,
  inputValidationMiddleware,
  async (req: Request<{}, {}, RideInputDto>, res: Response) => {
    const driverId = req.body.driverId;

    const driver = await driversRepository.findById(driverId);

    if (!driver) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );

      return;
    }

    const newRide = await ridesRepository.create(driver, req.body);

    res.status(HttpStatus.Created).send(newRide);
  },
);

ridesRoute.put(
  '/:id/status',
  adminMiddleware,
  idValidation,
  rideStatusValidation,
  inputValidationMiddleware,
  async (
    req: Request<{ id: string }, {}, { status: RideStatus }>,
    res: Response,
  ) => {
    const id = parseInt(req.params.id);
    //todo change status to driver????
    const isUpdated = await ridesRepository.updateStatus(id, req.body.status);

    if (!isUpdated) {
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
