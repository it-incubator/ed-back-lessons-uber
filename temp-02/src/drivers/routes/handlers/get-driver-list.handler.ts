import { Request, Response } from 'express';
import { driversRepository } from '../../repositories/drivers.repository';
import { HttpStatus } from '../../../core/types/http-statuses';

export function getDriverListHandler(req: Request, res: Response) {
  try {
    const drivers = driversRepository.findAll();
    res.send(drivers);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
