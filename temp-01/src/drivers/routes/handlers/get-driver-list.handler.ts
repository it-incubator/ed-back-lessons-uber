import { Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';

export function getDriverListHandler(req: Request, res: Response) {
  res.send(db.drivers);
}
