import { Request, Response } from 'express';
import { ridesRepository } from '../../repositories/rides.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { mapToRideViewModelUtil } from '../mappers/map-to-ride-view-model.util';

export async function getRideHandler(req: Request, res: Response) {
  const id = req.params.id;

  const ride = await ridesRepository.findById(id);

  if (!ride) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Ride not found' }]));

    return;
  }

  const rideViewModel = mapToRideViewModelUtil(ride);

  res.send(rideViewModel);
}
