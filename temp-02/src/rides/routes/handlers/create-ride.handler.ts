import { Request, Response } from 'express';
import { RideInputDto } from '../../dto/ride-input.dto';
import { driversRepository } from '../../../drivers/repositories/drivers.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { ridesRepository } from '../../repositories/rides.repository';
import { Ride } from '../../types/ride';
import { db } from '../../../db/in-memory.db';

export function createRideHandler(
  req: Request<{}, {}, RideInputDto>,
  res: Response,
) {
  const driverId = req.body.driverId;

  const driver = driversRepository.findById(driverId);

  if (!driver) {
    res
      .status(HttpStatus.BadRequest)
      .send(
        createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
      );

    return;
  }
  const newRide: Ride = {
    id: db.rides.length ? db.rides[db.rides.length - 1].id + 1 : 1,
    clientName: req.body.clientName,
    driverId: req.body.driverId,
    driverName: driver.name,
    vehicleLicensePlate: driver.vehicleLicensePlate,
    vehicleName: `${driver.vehicleMake} ${driver.vehicleModel}`,
    price: req.body.price,
    currency: req.body.currency,
    createdAt: new Date(),
    updatedAt: null,
    addresses: {
      from: req.body.fromAddress,
      to: req.body.toAddress,
    },
  };

  ridesRepository.createRide(newRide);

  res.status(HttpStatus.Created).send(newRide);
}
