import { Request, Response } from 'express';
import { RideStatus } from '../../types/ride';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { ridesRepository } from '../../repositories/rides.repository';
import { driversRepository } from '../../../drivers/repositories/drivers.repository';
import { DriverStatus } from '../../../drivers/types/driver';

export function updateRideStatusHandler(
  req: Request<{ id: string }, {}, { status: RideStatus }>,
  res: Response,
) {
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

  //todo fix
  const ride = ridesRepository.findById(id);

  if (!ride) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Ride not found' }]));

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
    DriverStatus.Online,
  );

  if (!isRideUpdated || !isDriverUpdated) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Ride not found' }]));

    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
