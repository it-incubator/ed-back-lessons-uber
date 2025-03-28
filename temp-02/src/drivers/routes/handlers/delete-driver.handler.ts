import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';
import { DriverStatus } from '../../types/driver';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';

export function deleteDriverHandler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    const driver = driversRepository.findById(id);

    if (!driver) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );

      return;
    }

    // Если у водителя сейчас есть заказ, то удалить его нельзя
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

    driversRepository.delete(id);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
