import { Request, Response } from 'express';
import { ridesRepository } from '../../repositories/rides.repository';

export function getRideListHandler(req: Request, res: Response) {
  const rides = ridesRepository.findAll();
  res.send(rides);
}
