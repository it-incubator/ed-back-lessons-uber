import { Request, Response } from 'express';
import { driversRepository } from '../../repositories/drivers.repository';
import { mapToDriverViewModel } from '../mappers/map-to-driver-view-model.util';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function getDriverListHandler(req: Request, res: Response) {
  try {
    const drivers = await driversRepository.findAll();

    const driverViewModels = drivers.map(mapToDriverViewModel);

    res.send(driverViewModels);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
