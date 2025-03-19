import { Request, Response } from 'express';
import { RideStatus } from '../../types/ride';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { ridesRepository } from '../../repositories/rides.repository';
import { driversRepository } from '../../../drivers/repositories/drivers.repository';
import { DriverStatus } from '../../../drivers/types/driver';
import { client } from '../../../db/mongo.db';
import { ClientSession } from 'mongodb';

export async function finishRideHandler(
  req: Request<{ id: string }, {}, {}>,
  res: Response,
) {
  const id = req.params.id;
  const ride = await ridesRepository.findById(id);

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
      .send(
        createErrorMessages([{ field: 'id', message: 'Ride is already over' }]),
      );

    return;
  }
  // Начало транзакции
  const session: ClientSession = client.startSession();
  session.startTransaction();

  try {
    await ridesRepository.updateStatus(id, RideStatus.Finished, session);

    await driversRepository.updateStatus(
      ride.driver.id,
      DriverStatus.Online,
      session,
    );

    // Подтверждение транзакции
    await session.commitTransaction();

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    // Откат транзакции в случае ошибки
    await session.abortTransaction();
    res.sendStatus(HttpStatus.InternalServerError);
  } finally {
    await session.endSession();
  }
}
