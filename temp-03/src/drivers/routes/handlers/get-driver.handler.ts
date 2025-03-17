import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { createDriverViewModel } from '../util/create-driver-view-model.util';

export async function getDriverHandler(req: Request, res: Response) {
  const id = req.params.id;

  const driver = await driversRepository.findById(id);

  if (!driver) {
    res
      .status(HttpStatus.NotFound)
      .send(
        createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
      );

    return;
  }

  const driverViewModel = createDriverViewModel(driver);

  res.status(HttpStatus.Ok).send(driverViewModel);
}
