import { Request, Response, Router } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpStatus } from '../../core/types/http-statuses';

import { Driver, DriverStatus } from '../types/driver';
import { DriverInputDto } from '../dto/driver.input-dto';
import { vehicleInputDtoValidation } from './vehicleInputDtoValidation';
import { createErrorMessages } from '../../core/utils/error.utils';

export const driversRouter = Router({});

driversRouter
  .get('', (req: Request, res: Response) => {
    res.send(db.drivers);
  })

  .get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const driver = db.drivers.find((d) => d.id === id);

    if (!driver) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );

      return;
    }

    res.send(driver);
  })

  .post('', (req: Request<{}, {}, DriverInputDto>, res: Response) => {
    const errors = vehicleInputDtoValidation(req.body);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));

      return;
    }

    const newDriver: Driver = {
      id: db.drivers.length ? db.drivers[db.drivers.length - 1].id + 1 : 1,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      status: DriverStatus.AwaitingOrder,
      vehicleMake: req.body.vehicleMake,
      vehicleModel: req.body.vehicleModel,
      vehicleYear: req.body.vehicleYear,
      vehicleLicensePlate: req.body.vehicleLicensePlate,
      vehicleDescription: req.body.vehicleDescription,
      vehicleFeatures: req.body.vehicleFeatures,
      createdAt: new Date(),
    };

    db.drivers.push(newDriver);
    res.status(HttpStatus.Created).send(newDriver);
  })

  .put(
    '/:id',
    (req: Request<{ id: string }, {}, DriverInputDto>, res: Response) => {
      const id = parseInt(req.params.id);
      const index = db.drivers.findIndex((v) => v.id === id);

      if (index === -1) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([
              { field: 'id', message: 'Vehicle not found' },
            ]),
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
    },
  )

  .put(
    '/:id/status',
    (
      req: Request<{ id: string }, {}, { status: DriverStatus }>,
      res: Response,
    ) => {
      const id = parseInt(req.params.id);
      const index = db.drivers.findIndex((v) => v.id === id);

      if (index === -1) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([
              { field: 'id', message: 'Vehicle not found' },
            ]),
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
    },
  )

  .delete('/:id', (req: Request, res: Response) => {
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
  });
