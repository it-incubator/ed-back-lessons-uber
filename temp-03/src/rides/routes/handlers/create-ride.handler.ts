import { Request, Response } from 'express';
import { RideInputDto } from '../../dto/ride-input.dto';
import { driversRepository } from '../../../drivers/repositories/drivers.repository';
import { DriverStatus } from '../../../drivers/types/driver';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { ridesRepository } from '../../repositories/rides.repository';
import { ClientSession } from 'mongodb';
import { client } from '../../../db/mongo.db';
import { Ride, RideStatus } from '../../types/ride';
import { createRideViewModelUtil } from '../util/create-ride-view-model.util';

export async function createRideHandler(
  req: Request<{}, {}, RideInputDto>,
  res: Response,
) {
  const driverId = req.body.driverId;

  const driver = await driversRepository.findById(driverId);

  if (!driver || driver.status !== DriverStatus.Online) {
    res
      .status(HttpStatus.BadRequest)
      .send(
        createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
      );

    return;
  }

  // Начало транзакции
  const session: ClientSession = client.startSession();
  session.startTransaction();

  try {
    const newRide: Ride = {
      clientName: req.body.clientName,
      driverId: req.body.driverId,
      driverName: driver.name,
      vehicleLicensePlate: driver.vehicleLicensePlate,
      vehicleName: `${driver.vehicleMake} ${driver.vehicleModel}`,
      price: req.body.price,
      currency: req.body.currency,
      status: RideStatus.InProgress,
      createdAt: new Date(),
      updatedAt: null,
      startedAt: new Date(),
      finishedAt: null,
      addresses: {
        from: req.body.startAddress,
        to: req.body.endAddress,
      },
    };

    const createdRide = await ridesRepository.createRide(newRide, session);

    await driversRepository.updateStatus(
      driver._id.toString(),
      DriverStatus.OnOrder,
      session,
    );
    // Подтверждение транзакции
    await session.commitTransaction();

    const rideViewModel = createRideViewModelUtil(createdRide);

    res.status(HttpStatus.Created).send(rideViewModel);
  } catch (e: unknown) {
    // Откат транзакции в случае ошибки

    await session.abortTransaction();
    throw new Error(`Transaction aborted due to error: ${e}`);
  } finally {
    await session.endSession();
  }
}
