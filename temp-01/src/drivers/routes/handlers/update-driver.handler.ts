import { Request, Response } from 'express';
import { DriverInputDto } from '../../dto/driver.input-dto';
import { db } from '../../../db/in-memory.db';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { vehicleInputDtoValidation } from '../vehicleInputDtoValidation';

export function updateDriverHandler(
  req: Request<{ id: string }, {}, DriverInputDto>,
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

    const errors = vehicleInputDtoValidation(req.body);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));

      return;
    }

    const driver = db.drivers[index];

    driver.name = req.body.name;
    driver.phoneNumber = req.body.phoneNumber;
    driver.email = req.body.email;
    driver.vehicleMake = req.body.vehicleMake;
    driver.vehicleModel = req.body.vehicleModel;
    driver.vehicleYear = req.body.vehicleYear;
    driver.vehicleLicensePlate = req.body.vehicleLicensePlate;
    driver.vehicleDescription = req.body.vehicleDescription;
    driver.vehicleFeatures = req.body.vehicleFeatures;

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
