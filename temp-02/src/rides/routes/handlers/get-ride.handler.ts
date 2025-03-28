import { Request, Response } from 'express';
import { ridesRepository } from '../../repositories/rides.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';

export function getRideHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);

  const ride = ridesRepository.findById(id);

  if (!ride) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Ride not found' }]));

    return;
  }

  res.send(ride);
}
