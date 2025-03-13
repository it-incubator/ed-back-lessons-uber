import { Request, Response } from 'express';
import { DriverInputDto } from '../../dto/driver.input-dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';

export function updateDriverHandler(
  req: Request<{ id: string }, {}, DriverInputDto>,
  res: Response,
) {
  const id = parseInt(req.params.id);

  const isUpdated = driversRepository.update(id, req.body);

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
