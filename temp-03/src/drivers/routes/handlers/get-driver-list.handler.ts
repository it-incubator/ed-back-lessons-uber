import { Request, Response } from 'express';
import { driversRepository } from '../../repositories/drivers.repository';
import { createDriverViewModel } from '../util/create-driver-view-model.util';

export async function getDriverListHandler(req: Request, res: Response) {
  const drivers = await driversRepository.findAll();

  const driverViewModels = drivers.map((driver) =>
    createDriverViewModel(driver),
  );

  res.send(driverViewModels);
}
