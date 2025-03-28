import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';

export function getDriverHandler(req: Request, res: Response) {
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

  res.status(HttpStatus.Ok).send(driver);
}
