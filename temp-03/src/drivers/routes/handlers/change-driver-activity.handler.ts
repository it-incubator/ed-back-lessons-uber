import { Request, Response } from 'express';
import { DriverStatus } from '../../types/driver';
import { HttpStatus } from '../../../core/types/http-statuses';

import { driversRepository } from '../../repositories/drivers.repository';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { ChangeDriverStatusInputDto } from '../../dto/change-driver-activity.input-dto';

export const availableStatusesForChange = [
  DriverStatus.Offline,
  DriverStatus.Online,
];

export async function changeDriverActivityHandler(
  req: Request<{ id: string }, {}, { status: ChangeDriverStatusInputDto }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    /*
     * Можно менять только доступные статусы для изменения 'online'и 'offline'
     */
    if (!availableStatusesForChange.includes(req.body.status)) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([
            { field: 'status', message: 'incorrect status' },
          ]),
        );

      return;
    }

    const driver = await driversRepository.findById(id);

    if (!driver) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );

      return;
    }

    // Если у водителя сейчас есть заказ, то поменять ему статус нельзя
    if (driver.status === DriverStatus.OnOrder) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([
            { field: 'status', message: 'The driver is currently on a job' },
          ]),
        );

      return;
    }

    await driversRepository.updateStatus(id, req.body.status);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
