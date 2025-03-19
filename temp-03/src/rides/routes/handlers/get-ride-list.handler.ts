import { Request, Response } from 'express';
import { ridesRepository } from '../../repositories/rides.repository';
import { mapToRideViewModelUtil } from '../mappers/map-to-ride-view-model.util';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function getRideListHandler(req: Request, res: Response) {
  try {
    const rides = await ridesRepository.findAll();

    const rideViewModels = rides.map(mapToRideViewModelUtil);
    res.send(rideViewModels);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
