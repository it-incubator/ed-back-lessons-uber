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
  const newStatus = req.body.status;

  const ride = ridesRepository.findById(id);

  if (!ride) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Ride not found' }]));

    return;
  }

  //Если поездка уже завершена, то обновить статус ей нельзя
  if (ride.status === RideStatus.Finished) {
    res
      .status(HttpStatus.BadRequest)
      .send(createErrorMessages([{ field: 'id', message: 'Ride not found' }]));

    return;
  }

  if (ride.status !== newStatus) {
    const driver = driversRepository.findById(ride.driverId);

    if (!driver) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );

      return;
    }

    const isRideUpdated = ridesRepository.updateStatus(id, newStatus);

    const isDriverUpdated = driversRepository.updateStatus(
      ride.driverId,
      DriverStatus.Online,
    );

    if (!isRideUpdated || !isDriverUpdated) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Ride not found' }]),
        );

      return;
    }
  }

  res.sendStatus(HttpStatus.NoContent);
}
