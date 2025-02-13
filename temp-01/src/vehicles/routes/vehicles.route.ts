import { Router, Request, Response } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpStatus } from '../../core/types/http-statuses';

import { Vehicle, VehicleStatus } from '../types/vehicle';

export const vehiclesRouter = Router({});

interface ValidationError {
  field: string;
  message: string;
}

const createErrorMessages = (
  errors: ValidationError[],
): { errorMessages: ValidationError[] } => {
  return { errorMessages: errors };
};

const validateVehicle = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (
    !data.name ||
    typeof data.name !== 'string' ||
    data.name.length < 2 ||
    data.name.length > 15
  ) {
    errors.push({ field: 'name', message: 'Invalid name' });
  }

  if (
    !data.driver ||
    typeof data.driver !== 'string' ||
    data.driver.length < 2 ||
    data.driver.length > 20
  ) {
    errors.push({ field: 'driver', message: 'Invalid driver' });
  }

  if (data.status) {
    if (!Object.values(VehicleStatus).includes(data.status)) {
      errors.push({ field: 'status', message: 'Invalid status' });
    }
  }

  if (!data.number || typeof data.number !== 'number') {
    errors.push({ field: 'number', message: 'Invalid number' });
  }

  return errors;
};

vehiclesRouter
  .get('', (req: Request, res: Response) => {
    res.send(db.vehicles);
  })

  .get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const vehicle = db.vehicles.find((v) => v.id === id);

    if (!vehicle) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Vehicle not found' }]),
        );

      return;
    }

    res.send(vehicle);
  })

  .post('', (req: Request, res: Response) => {
    const errors = validateVehicle(req.body);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));

      return;
    }

    const newVehicle: Vehicle = {
      id: db.vehicles.length ? db.vehicles[db.vehicles.length - 1].id + 1 : 1,
      driver: req.body.driver,
      name: req.body.name,
      number: req.body.number,
      //default values
      status: VehicleStatus.AwaitingOrder,
      createdAt: new Date(),
    };

    db.vehicles.push(newVehicle);
    res.status(HttpStatus.Created).send(newVehicle);
  })

  .put('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = db.vehicles.findIndex((v) => v.id === id);

    if (index === -1) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Vehicle not found' }]),
        );

      return;
    }

    const errors = validateVehicle(req.body);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));

      return;
    }

    db.vehicles[index] = {
      ...db.vehicles[index],
      driver: req.body.driver,
      name: req.body.name,
      number: req.body.number,
      status: req.body.status,
    };

    res.sendStatus(HttpStatus.NoContent);
  })

  .delete('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = db.vehicles.findIndex((v) => v.id === id);

    if (index === -1) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Vehicle not found' }]),
        );

      return;
    }

    db.vehicles.splice(index, 1);

    res.sendStatus(HttpStatus.NoContent);
  });
