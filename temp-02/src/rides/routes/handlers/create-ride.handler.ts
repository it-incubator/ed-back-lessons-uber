import { Request, Response } from 'express';
import { RideInputDto } from '../../dto/ride-input.dto';
import { driversRepository } from '../../../drivers/repositories/drivers.repository';
import { DriverStatus } from '../../../drivers/types/driver';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { ridesRepository } from '../../repositories/rides.repository';

export function createRideHandler(
  req: Request<{}, {}, RideInputDto>,
  res: Response,
) {
  const driverId = req.body.driverId;

  const driver = driversRepository.findById(driverId);

  if (!driver || driver.status !== DriverStatus.Online) {
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
}
