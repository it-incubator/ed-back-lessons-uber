import { Request, Response } from 'express';
import { ridesRepository } from '../../repositories/rides.repository';
import { mapToRideViewModelUtil } from '../mappers/map-to-ride-view-model.util';

export async function getRideListHandler(req: Request, res: Response) {
  const rides = await ridesRepository.findAll();

  const rideViewModels = rides.map(mapToRideViewModelUtil);
  res.send(rideViewModels);
}
