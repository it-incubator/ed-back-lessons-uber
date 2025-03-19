import { Request, Response } from 'express';
import { DriverStatus } from '../../types/driver';
import { db } from '../../../db/in-memory.db';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';

export function updateDriverStatusHandler(
  req: Request<{ id: string }, {}, { status: DriverStatus }>,
  res: Response,
) {
  try {
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

    if (!Object.values(DriverStatus).includes(req.body.status)) {
      res
        .status(HttpStatus.BadRequest)
        .send([{ field: 'status', message: 'incorrect status' }]);

      return;
    }

    db.drivers[index].status = req.body.status;

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
