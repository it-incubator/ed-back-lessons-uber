import { Request, Response } from 'express';
import { RideInputDto } from '../../dto/ride-input.dto';
import { driversRepository } from '../../../drivers/repositories/drivers.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { ridesRepository } from '../../repositories/rides.repository';
import { Ride } from '../../types/ride';
import { mapToRideViewModelUtil } from '../mappers/map-to-ride-view-model.util';

export async function createRideHandler(
  req: Request<{}, {}, RideInputDto>,
  res: Response,
) {
  try {
    const driverId = req.body.driverId;

    const driver = await driversRepository.findById(driverId);

    if (!driver) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );

      return;
    }

    // Если у водителя сейчас есть заказ, то создать новую поездку нельзя
    const activeRide = await ridesRepository.findActiveRideByDriverId(driverId);

    if (activeRide) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([
            { field: 'status', message: 'The driver is currently on a job' },
          ]),
        );

      return;
    }

    const newRide: Ride = {
      clientName: req.body.clientName,
      driver: {
        id: req.body.driverId,
        name: driver.name,
      },
      vehicle: {
        licensePlate: driver.vehicle.licensePlate,
        name: `${driver.vehicle.make} ${driver.vehicle.model}`,
      },
      price: req.body.price,
      currency: req.body.currency,
      createdAt: new Date(),
      updatedAt: null,
      startedAt: new Date(),
      finishedAt: null,
      addresses: {
        from: req.body.fromAddress,
        to: req.body.toAddress,
      },
    };

    const createdRide = await ridesRepository.createRide(newRide);

    const rideViewModel = mapToRideViewModelUtil(createdRide);

    res.status(HttpStatus.Created).send(rideViewModel);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
