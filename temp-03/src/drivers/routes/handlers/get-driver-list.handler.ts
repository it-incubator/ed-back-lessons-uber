import { Request, Response } from 'express';
import { driversRepository } from '../../repositories/drivers.repository';
import { mapToDriverViewModel } from '../mappers/map-to-driver-view-model.util';

export async function getDriverListHandler(req: Request, res: Response) {
  const drivers = await driversRepository.findAll();

  const driverViewModels = drivers.map(mapToDriverViewModel);

  res.send(driverViewModels);
}
