import { Request, Response } from 'express';
import { ridesRepository } from '../../repositories/rides.repository';
import { createRideViewModelUtil } from '../util/create-ride-view-model.util';

export async function getRideListHandler(req: Request, res: Response) {
  const rides = await ridesRepository.findAll();

  const rideViewModels = rides.map((ride) => createRideViewModelUtil(ride));
  res.send(rideViewModels);
}
