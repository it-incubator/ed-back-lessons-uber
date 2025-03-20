import { Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpStatus } from '../../../core/types/http-statuses';

export function getDriverListHandler(req: Request, res: Response) {
  try {
    res.send(db.drivers);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
