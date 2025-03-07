import { Request, Response } from 'express';
import { DriverStatus } from '../../types/driver';
import { HttpStatus } from '../../../core/types/http-statuses';

import { driversRepository } from '../../repositories/drivers.repository';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { availableStatusesForChange } from '../../dto/change-driver-activity.dto';

export function changeDriverActivityHandler(
  req: Request<{ id: string }, {}, { status: DriverStatus }>,
  res: Response,
) {
  const id = parseInt(req.params.id);

  /*
   * Можно менять только доступные статусы для изменения 'online'и 'offline'
   */
  if (!availableStatusesForChange.includes(req.body.status)) {
    res
      .status(HttpStatus.BadRequest)
      .send(
        createErrorMessages([
          { field: 'status', message: 'Details of the order are required' },
        ]),
      );

    return;
  }

  const driver = driversRepository.findById(id);

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

  const isUpdated = driversRepository.updateStatus(id, req.body.status);

  if (!isUpdated) {
    res
      .status(HttpStatus.NotFound)
      .send(
        createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
      );

    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
