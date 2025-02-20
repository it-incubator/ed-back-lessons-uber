import { Router, Request, Response } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpStatus } from '../../core/types/http-statuses';

import { Vehicle, VehicleFeature, VehicleStatus } from '../types/vehicle';

export const vehiclesRouter = Router({});

interface ValidationError {
  field: string;
  message: string;
}

type VehicleInputDto = {
  name: string;
  driver: string;
  number: number;
  description?: string;
  features?: VehicleFeature[];
};

const createErrorMessages = (
  errors: ValidationError[],
): { errorMessages: ValidationError[] } => {
  return { errorMessages: errors };
};

const vehicleInputDtoValidation = (
  data: VehicleInputDto,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (
    !data.name ||
    typeof data.name !== 'string' ||
    data.name.trim().length < 2 ||
    data.name.trim().length > 15
  ) {
    errors.push({ field: 'name', message: 'Invalid name' });
  }

  if (
    !data.driver ||
    typeof data.driver !== 'string' ||
    data.driver.trim().length < 2 ||
    data.driver.trim().length > 20
  ) {
    errors.push({ field: 'driver', message: 'Invalid driver' });
  }

  if (!data.number || typeof data.number !== 'number') {
    errors.push({ field: 'number', message: 'Invalid number' });
  }

  if (data.description) {
    if (
      typeof data.description !== 'string' ||
      data.description.trim().length < 10 ||
      data.description.trim().length > 200
    ) {
      errors.push({ field: 'driver', message: 'Invalid driver' });
    }
  }

  if (Array.isArray(data.features)) {
    const existingFeatures = Object.values(VehicleFeature);
    if (
      data.features.length > existingFeatures.length ||
      data.features.length < 1
    ) {
      errors.push({ field: 'features', message: 'Invalid features' });
    }
    for (const feature of data.features) {
      if (!existingFeatures.includes(feature)) {
        errors.push({ field: 'features', message: 'Invalid feature' });
        break;
      }
    }
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

  .post('', (req: Request<{}, {}, VehicleInputDto>, res: Response) => {
    const errors = vehicleInputDtoValidation(req.body);

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
      description: req.body.description || null,
      features: req.body.features || null,
      status: VehicleStatus.AwaitingOrder,
      createdAt: new Date(),
    };

    db.vehicles.push(newVehicle);
    res.status(HttpStatus.Created).send(newVehicle);
  })

  .put(
    '/:id',
    (req: Request<{ id: string }, {}, VehicleInputDto>, res: Response) => {
      const id = parseInt(req.params.id);
      const index = db.vehicles.findIndex((v) => v.id === id);

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

      db.vehicles[index] = {
        ...db.vehicles[index],
        driver: req.body.driver,
        name: req.body.name,
        number: req.body.number,
        //optional value
        ...(req.body.description && { description: req.body.description }),
        ...(req.body.features && { features: req.body.features }),
      };

      res.sendStatus(HttpStatus.NoContent);
    },
  )

  .put(
    '/:id/status',
    (
      req: Request<{ id: string }, {}, { status: VehicleStatus }>,
      res: Response,
    ) => {
      const id = parseInt(req.params.id);
      const index = db.vehicles.findIndex((v) => v.id === id);

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

      if (!Object.values(VehicleStatus).includes(req.body.status)) {
        res
          .status(HttpStatus.BadRequest)
          .send([{ field: 'status', message: 'incorrect status' }]);

        return;
      }

      db.vehicles[index] = {
        ...db.vehicles[index],
        status: req.body.status,
      };

      res.sendStatus(HttpStatus.NoContent);
    },
  )

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
