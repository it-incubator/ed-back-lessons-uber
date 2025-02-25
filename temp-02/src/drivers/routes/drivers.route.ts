import { Request, Response, Router } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';

import { DriverStatus } from '../types/driver';
import { DriverInputDto } from '../dto/driver.input-dto';
import { vehicleInputDtoValidation } from './vehicleInputDtoValidation';
import { createErrorMessages } from '../../core/utils/error.utils';
import { driversRepository } from '../repositories/drivers.repository';

export const driversRouter = Router({});

driversRouter
  .get('', async (req: Request, res: Response) => {
    const drivers = await driversRepository.findAll();
    res.send(drivers);
  })

  .get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const driver = await driversRepository.findById(id);

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

  .post('', async (req: Request<{}, {}, DriverInputDto>, res: Response) => {
    const errors = vehicleInputDtoValidation(req.body);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));

      return;
    }

    const newDriver = await driversRepository.create(req.body);

    res.status(HttpStatus.Created).send(newDriver);
  })

  .put(
    '/:id',
    async (req: Request<{ id: string }, {}, DriverInputDto>, res: Response) => {
      const id = parseInt(req.params.id);

      const errors = vehicleInputDtoValidation(req.body);

      if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));

        return;
      }

      const isUpdated = await driversRepository.update(id, req.body);

      if (!isUpdated) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
          );
        return;
      }

      res.sendStatus(HttpStatus.NoContent);
    },
  )

  .put(
    '/:id/status',
    async (
      req: Request<{ id: string }, {}, { status: DriverStatus }>,
      res: Response,
    ) => {
      const id = parseInt(req.params.id);

      if (!Object.values(DriverStatus).includes(req.body.status)) {
        res
          .status(HttpStatus.BadRequest)
          .send([{ field: 'status', message: 'incorrect status' }]);

        return;
      }

      const isUpdated = await driversRepository.updateStatus(
        id,
        req.body.status,
      );

      if (!isUpdated) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
          );

        return;
      }

      res.sendStatus(HttpStatus.NoContent);
    },
  )

  .delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const isDeleted = await driversRepository.delete(id);

    if (!isDeleted) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );

      return;
    }

    res.sendStatus(HttpStatus.NoContent);
  });
