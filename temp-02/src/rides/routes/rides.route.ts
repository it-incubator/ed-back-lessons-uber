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
  rideInputDtoValidation,
  rideStatusValidation,
} from './ride.input-dto.validation-middleware';
import { RideStatus } from '../types/ride';
import { RideInputDto } from '../dto/ride-input.dto';
import { driversRepository } from '../../drivers/repositories/drivers.repository';
import { DriverStatus } from '../../drivers/types/driver';

export const ridesRoute = Router({});

ridesRoute.use(superAdminGuardMiddleware);
ridesRoute.get('', (req: Request, res: Response) => {
  const rides = ridesRepository.findAll();
  res.send(rides);
});

ridesRoute.get(
  '/:id',
  idValidation,
  inputValidationResultMiddleware,
  (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const ride = ridesRepository.findById(id);

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
  rideInputDtoValidation,
  inputValidationResultMiddleware,
  (req: Request<{}, {}, RideInputDto>, res: Response) => {
    const driverId = req.body.driverId;

    const driver = driversRepository.findById(driverId);

    if (!driver || driver.status !== DriverStatus.AwaitingOrder) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );

      return;
    }

    const newRide = ridesRepository.createInProgressRide(driver, req.body);

    driversRepository.updateStatus(driver.id, DriverStatus.OnOrder);

    res.status(HttpStatus.Created).send(newRide);
  },
);

ridesRoute.put(
  '/:id/status',

  idValidation,
  rideStatusValidation,
  inputValidationResultMiddleware,
  (req: Request<{ id: string }, {}, { status: RideStatus }>, res: Response) => {
    const id = parseInt(req.params.id);

    //Нельзя поменять статус на 'in-progress'. Статус 'in-progress' устанавливается только при создании поезки
    if (req.body.status !== RideStatus.Finished) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([
            { field: 'status', message: 'Details of the order are required' },
          ]),
        );

      return;
    }

    const ride = ridesRepository.findById(id);

    if (!ride) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Ride not found' }]),
        );

      return;
    }

    const driver = driversRepository.findById(ride.driverId);

    if (!driver) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );

      return;
    }

    const isRideUpdated = ridesRepository.updateStatus(id, req.body.status);

    const isDriverUpdated = driversRepository.updateStatus(
      ride.driverId,
      DriverStatus.AwaitingOrder,
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
