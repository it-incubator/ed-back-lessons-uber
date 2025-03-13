import { Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';

export function deleteDriverHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const index = db.drivers.findIndex((v) => v.id === id);

  if (index === -1) {
    res
      .status(HttpStatus.NotFound)
      .send(
        createErrorMessages([{ field: 'id', message: 'Vehicle not found' }]),
      );

    return;
  }

  db.drivers.splice(index, 1);

  res.sendStatus(HttpStatus.NoContent);
}
