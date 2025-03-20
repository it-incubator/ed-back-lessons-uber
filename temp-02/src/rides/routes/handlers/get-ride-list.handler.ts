import { Request, Response } from 'express';
import { ridesRepository } from '../../repositories/rides.repository';
import { HttpStatus } from '../../../core/types/http-statuses';

export function getRideListHandler(req: Request, res: Response) {
  try {
    const rides = ridesRepository.findAll();
    res.send(rides);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
