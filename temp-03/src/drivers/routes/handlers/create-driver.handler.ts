import { Request, Response } from 'express';
import { DriverInputDto } from '../../dto/driver.input-dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';

export function createDriverHandler(
  req: Request<{}, {}, DriverInputDto>,
  res: Response,
) {
  const newDriver = driversRepository.create(req.body);

  res.status(HttpStatus.Created).send(newDriver);
}
